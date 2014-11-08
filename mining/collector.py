import urllib2
import urllib
from StringIO import StringIO
import gzip
import json
import os
import codecs
import threading
from random import randrange
from time import sleep


class Manager():
    def __init__(self, tags_writer):
        self.tags_writer = tags_writer
        self.read_lock = threading.Lock()
        self.write_lock = threading.Lock()
        self.tagscnt = 0
        self.tagslimit = 1000

        self.types = ['answer', 'question']
        self.tags = {'answer': {}, 'question': {}}
        self.body = {'answer': [], 'question': []}
        self.passed = {'answer': set(), 'question': set()}

    def add_entry(self, ID, body, tags, etype):
        self.write_lock.acquire(True)

        try:
            if not ID in self.passed[etype]:
                self.passed[etype].add(ID)
                self.body[etype].append((ID, body))

                # print etype,  self.body[etype].__len__()
                for tag in tags:
                    if not tag in self.tags[etype]:
                        self.tags[etype][tag] = []
                    self.tags[etype][tag].append(ID)
                    self.tagscnt = self.tagscnt + 1

            if self.tagslimit <= self.tagscnt:
                self.flush_tags(False)

        finally:
            self.write_lock.release()

    def get_entry(self, etype):
        self.read_lock.acquire(True)

        try:
            if self.body[etype].__len__() > 0:
                return self.body[etype].pop(0)
            else:
                return False
        finally:
            self.read_lock.release()

    def flush_tags(self, acquire):
        if acquire:
            self.write_lock.acquire(True)

        print('Flush tags')

        for etype in self.types:
            for tag in self.tags[etype]:
                self.tags_writer.write(tag, self.tags[etype][tag], etype)
            self.tags[etype] = {}

        if acquire:
            self.write_lock.release()


class SnippetWriter(threading.Thread):
    def __init__(self, ID, body, folder, lock):
        threading.Thread.__init__(self)
        self.daemon = True

        self.path = '.'
        self.folder = folder
        self.body = body
        self.ID = ID
        self.lock = lock


    def run(self):
        self.lock.acquire(True)

        print(self.folder + '  ' + self.ID.__str__())

        try:
            folder = os.path.join(self.path, self.folder)

            if not os.path.exists(folder):
                os.makedirs(folder)

            out = codecs.open(os.path.join(folder, self.ID.__str__() + '.html'), "w", "utf-8")
            out.write(self.body)
            out.close()
        finally:
            self.lock.release()


class SnippetRunner():
    def __init__(self, manager, readers):
        self.manager = manager
        self.readers = readers
        self.types = ['answer', 'question']
        self.locks = []
        for i in range(readers):
            self.locks.append(threading.Lock())

    def run(self):
        n = 1
        while True:
            for i in range(self.readers):
                r = self.locks[i].acquire(False)
                if not r:
                    n += 1
                else:
                    self.locks[i].release()

                    idx = randrange(2)

                    entry = self.manager.get_entry(self.types[idx])
                    if not entry: continue

                    w = SnippetWriter(entry[0], entry[1], self.types[idx], self.locks[i])
                    w.start()

            n = 0
            sleep(0.1)


class TagsWriter():
    def __init__(self):
        self.path = os.path.join('.', 'tags')
        if not os.path.exists(self.path):
            os.makedirs(self.path)

    def write(self, name, ids, prefix):
        out = open(os.path.join(self.path, name), "a")

        for k, v in enumerate(ids):
            out.write( '/' + prefix + '/' + v.__str__() + ".html\n")
        out.close()


class PageLoader(threading.Thread):
    def download(self):

        try:
            query = urllib.urlencode(self.params)
            url = self.baseurl + '?' + query

            print(url)

            request = urllib2.Request(url)
            request.add_header('Accept-encoding', 'gzip')
            response = urllib2.urlopen(request)
            if response.info().get('Content-Encoding') == 'gzip':
                buf = StringIO(response.read())
                f = gzip.GzipFile(fileobj=buf)
                raw = f.read()
            else:
                raw = response.read()

            data = json.loads(raw)

            for question in data[u'items']:
                self.manager.add_entry(question[u'question_id'], question[u'body'], question[u'tags'], 'question')
                if u'answers' in question and question[u'answers'].__len__() > 0:
                    for answer in question[u'answers']:
                        self.manager.add_entry(answer[u'answer_id'], answer[u'body'], question[u'tags'], 'answer')

            self.manager.flush_tags(True)

        except:
            return False;

        return True

    def __init__(self, params, manager):
        threading.Thread.__init__(self)
        self.daemon = True

        self.baseurl = 'https://api.stackexchange.com/2.2/questions'

        params['page'] = 1
        params['site'] = 'stackoverflow'
        params['filter'] = '!gB66oJbwvbd250ho0PQ7KOfUSej(N37(_xy'
        params['key'] = 'LxeP1AMviWrz1ukID*JN*g(('

        self.params = params
        self.manager = manager

    def run(self):
        page = 50
        while True:
            self.params['page'] = page
            res = self.download()
            if res:
                page = page + 1


t = TagsWriter()
manager = Manager(t)

loaders = {
    'newest': PageLoader({'order': 'desc', 'sort': 'creation'}, manager),
    'oldest': PageLoader({'order': 'asc', 'sort': 'creation'}, manager),
    'most_active': PageLoader({'order': 'desc', 'sort': 'votes'}, manager)
}

for k in loaders:
    loaders[k].start()

runner = SnippetRunner(manager, 10)
runner.run()