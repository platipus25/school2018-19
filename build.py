#!/usr/bin/env python3
import json
import shutil

with open('extension/manifest.json') as f:
    read_data = f.read()
    #print(read_data)
    read_object = json.loads(read_data)
    version = read_object["version"]
    shortname = read_object["short_name"]

filepath = "builds/{0}v{1}".format(shortname, version)
shutil.make_archive(filepath, 'zip', "extension")
print("archive at {0}".format(filepath))
