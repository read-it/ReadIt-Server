import urllib
import sys
import re

argc = len(sys.argv)

if argc != 2:
	print('usage: python count.py url')
	exit()

path = sys.argv[1]

response = urllib.urlopen(path)
html = response.read().decode("utf-8")

body = re.search('<body.*</body>', html, re.I|re.S)

if (body is None) :
	print ("No <body> in html")
	exit()

body = body.group()
body = re.sub('<script.*?>.*?</script>', '', body, 0, re.I|re.S)

text = re.sub('<.+?>', '', body, 0, re.I|re.S)

nospace = re.sub('&nbsp;| |\t|\r|\n', '', text)

print (nospace.encode('utf-8'))
print ('html = ', len(html), ', text = ', len(text), ', nospace = ', len(nospace))