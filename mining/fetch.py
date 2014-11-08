import os
import codecs

tagsfile = './tagsfile'
tagsfolder = './tags'
resultfolder = './../data/snippets'

def make_codes(data):
    parts = data.split('<code>')
    if parts.__len__() == 1:
        return False

    result = []
    for k, v in enumerate(parts):
        if k % 2 == 0:
            continue

        subparts = v.split('</code>')
        code = subparts[0]
        if 30 < code.__len__() < 3000:
            result.append(code)

    return result


with open(tagsfile) as filetags:
    for tag in filetags.readlines():
        tag = tag.strip()
        path = os.path.join(tagsfolder, tag)
        current = 1

        folder = os.path.join(resultfolder, tag)
        if not os.path.exists(folder):
            os.mkdir(folder)

        with open(path) as fileentries:
            for entry in fileentries.readlines():
                entry = '.' + entry.strip()

                if not os.path.isfile(entry):
                    continue

                with codecs.open(entry, "r", "utf-8") as fileentry:
                    codes = make_codes(fileentry.read())
                    if codes:
                        for code in codes:
                            with codecs.open(os.path.join(folder, current.__str__()), "w", "utf-8") as out:
                                out.write(code)
                                current = current + 1
