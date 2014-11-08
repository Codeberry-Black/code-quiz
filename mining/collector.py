import urllib2
import urllib
from StringIO import StringIO
import gzip
import json
import os


class Manager():
    def __init__(self):
        self.atags = {}
        self.aids = {}
        #self.answer_lock



        self.qtags = {}
        self.qids = {}

    def add_question(self, ID, body, tags):
        print(id)

    def add_answer(self, ID, body, tags):
        print(id)




class SnippetWriter():
    def __init__(self):
        self.path = '.'

    def write(self, ID, body, folder):
        folder = os.path.join(self.path, folder)

        if not os.path.exists(folder):
            os.makedirs(folder)

        out = open(os.path.join(folder, ID.__str__()), "w")
        out.write(body)
        out.close()


class TagsWriter():
    def __init__(self):
        self.path = os.path.join('.', 'tags')
        if not os.path.exists(self.path):
            os.makedirs(self.path)

    def write(self, name, ids):
        out = open(os.path.join(self.path, name), "a")

        for k, v in enumerate(ids):
            out.write(v.__str__() + "\n")
        out.close()

class PageLoader():
    def download(self):
        query = urllib.urlencode(self.params)
        url = self.baseurl + '?' + query

        request = urllib2.Request(url)
        request.add_header('Accept-encoding', 'gzip')
        response = urllib2.urlopen(request)
        if response.info().get('Content-Encoding') == 'gzip':
            buf = StringIO(response.read())
            f = gzip.GzipFile(fileobj=buf)
            raw = f.read()
        else:
            raw = response.read()

        return  json.loads(raw)

    def __init__(self, params, manager):
        self.baseurl = 'https://api.stackexchange.com/2.2/questions'

        params['page'] = 1
        params['site'] = 'stackoverflow'
        params['filter'] = '!gB66oJbwvbd250ho0PQ7KOfUSej(N37(_xy'

        self.params = params
        self.manager = manager


manager = Manager()

newest = PageLoader({'order': 'desc', 'sort': 'creation'}, manager)
oldest = PageLoader({'order': 'asc', 'sort': 'creation'}, manager)
most_active = PageLoader({'order': 'desc', 'sort': 'votes'}, manager)
#less_active = PageLoader({'order': 'asc', 'sort': 'votes'}, manager)


t = TagsWriter()
t.write('test', [1,2,3,4,5,6])
t.write('test', [1,2,3,4,5,6])



w = SnippetWriter()
w.write(1, 'Test', 'questions')
w.write(1, 'Test', 'answers')