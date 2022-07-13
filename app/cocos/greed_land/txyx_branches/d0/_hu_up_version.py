import os
import sys

data = ''
buildVersion = ''
fileName = ''
if(sys.argv[2] == 'ios'):
	fileName = 'version.sh'
elif(sys.argv[2] == 'android'):
	fileName = '_hu_version.bat'
elif(sys.argv[2] == 'macandroid'):
	fileName = 'version_android.sh'

with open(fileName, 'r+') as f:
	for line in f.readlines():
		if(line.find('VERSION') != -1):
			if(sys.argv[1] == 'true'):
				print(line[(line.find('.') + 1):line.rfind('.')])
				line = line[0:line.find('.') + 1] + str(int(line[(line.find('.') + 1):line.rfind('.')]) + 1) + '.0'
			else:
				line = line[0:line.rfind('.') + 1] + str(int(line[line.rfind('.') + 1:len(line)]) + 1)
		data += line
with open(fileName, 'w') as f:
	f.writelines(data)