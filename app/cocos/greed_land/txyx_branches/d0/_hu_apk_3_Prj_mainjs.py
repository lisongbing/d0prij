import os
import sys

data = ''
with open(sys.argv[1] + '/main.js', 'r+') as f:
	for line in f.readlines():
		if(line.find('window.boot();') != -1):
 			code= "\n"       
			code += "\t(function () {\n"
			code += "\t\tif (cc.sys.isNative && !cc.sys.curBuildVersion) {\n"
			code += "\t\t\tcc.sys.curBuildVersion = '"
			code += sys.argv[2]
			code += "';\n";
			code += "\t\t\tcc.sys.curDevMode = '"
			code += sys.argv[4]
			code += "';\n";
			code += "\t\t\tcc.sys.needShenfenReg = false;\n" 
			code += "\t\t\tcc.sys.useTestVer = true;\n"          
			code += "\t\t\tvar localBuildVersion = cc.sys.localStorage.getItem('currentVersion');\n"
			code += "\t\t\tconsole.log('cc.sys.curBuildVersion: ' + cc.sys.curBuildVersion);\n"
			code += "\t\t\tconsole.log('currentVersion: ' + localBuildVersion);\n"            
			code += "\t\t\tif(localBuildVersion != null) {\n"
			code += "\t\t\t\tlocalBuildVersion = localBuildVersion.substr(0,localBuildVersion.lastIndexOf('.'));\n"
			code += "\t\t\t\tif(localBuildVersion == cc.sys.curBuildVersion) {\n"
			code +=	"\t\t\t\t\tvar hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths');\n"
			code += "\t\t\t\t\tif (hotUpdateSearchPaths) {\n"
			code +=	"\t\t\t\t\t\tjsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));\n"
			code +=	"\t\t\t\t\t}\n"
			code += "\t\t\t\t}\n\t\t\t} else {\n"
			code += "\t\t\t\tcc.sys.localStorage.clear();\n";
			code += "\t\t\t}\n"
			code += "\t\t}\n"
			code += "\t})();\n\n"
			line = code + line
		data += line
with open(sys.argv[1] + '/main.js', 'r+') as f:
	f.writelines(data)
	
data = ''
if sys.argv[3] == 'android':
	with open(sys.argv[1] + '/frameworks/runtime-src/proj.android-studio/app/build.gradle', 'r+') as f:
		for line in f.readlines():
			if(line.find('versionCode') != -1):
				line = '\t\tversionCode ' + str(int(filter(str.isdigit, sys.argv[2]))) + '\n'
			if(line.find('versionName') != -1):
				line = '\t\tversionName "' + sys.argv[2] + '"\n'
			data += line
	with open(sys.argv[1] + '/frameworks/runtime-src/proj.android-studio/app/build.gradle', 'r+') as f:
		f.writelines(data)
	data = ''
	#with open(sys.argv[1] + '/frameworks/runtime-src/proj.android-studio/app/res/values/strings.xml', 'r+') as f:
	#	for line in f.readlines():
	#		if(line.find('app_name') != -1):
	#			line = '\t<string name="app_name" translatable="false">' + sys.argv[4] + '</string>\n'
	#		data += line
	#with open(sys.argv[1] + '/frameworks/runtime-src/proj.android-studio/app/res/values/strings.xml', 'r+') as f:
	#	f.writelines(data)
elif sys.argv[3] == 'ios':
	skip = False;
	with open(sys.argv[1] + '/frameworks/runtime-src/proj.ios_mac/ios/Info.plist', 'r+') as f:
		for line in f.readlines():
			if not skip:
				if(line.find('CFBundleVersion') != -1):
					line += '    <string>' + str(int(filter(str.isdigit, sys.argv[2]))) + '</string>\n'
					skip = True
				if(line.find('CFBundleShortVersionString') != -1):
					line += '    <string>' + sys.argv[2] + '</string>\n'
					skip = True
				if(line.find('CFBundleDisplayName') != -1):
					line += '    <string>' + sys.argv[4] + '</string>\n'
					skip = True
				data += line
			else:
				skip = False
	with open(sys.argv[1] + '/frameworks/runtime-src/proj.ios_mac/ios/Info.plist', 'r+') as f:
		f.writelines(data)