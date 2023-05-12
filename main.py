 # -*- coding: utf-8 -*-
import re
import sys
import glob
args = sys.argv
beforeWord = 'https://mobile-api.adguard.org/api/2.0/checkupdate.html'
afterWord = 'https://upd-adgrd.cf-inagi-saki.workers.dev/'
files = glob.glob("./adguard/**/*.smali", recursive=True)
for file in files :
    with open(file, "r") as f :
        result = [ row.replace(beforeWord, afterWord) for row in f ]
    with open(file, "w") as f :
        f.writelines(result)
with open("src/index.ts", 'r') as f:
    content = f.read()
    result = re.sub(r'const latest_version = "(.*)"', "const latest_version = \""+args[1]+"\"", content)
    result = re.sub(r'const latest_display_version = "(.*)"', "const latest_display_version = \""+args[2]+"\"", result)
with open("src/index.ts", 'w') as f:
    f.write(result)
