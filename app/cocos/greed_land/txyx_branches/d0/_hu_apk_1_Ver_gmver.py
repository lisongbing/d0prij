import os
import sys
data = ''
with open('assets/scripts/GameConfig.js', 'r+') as f:
	for line in f.readlines():
		#if(line.find('appName') != -1):
		#	line = '\tappName: %s' % ("'" + sys.argv[1] + "',",) + '\n'
		if(line.find('gameVersion') != -1):
			line = '\tgameVersion: %s' % ("'" + sys.argv[1][0:sys.argv[1].rindex('.')] + ".0',",) + '\n'
		data += line
with open('assets/scripts/GameConfig.js', 'w') as f:
	f.writelines(data)