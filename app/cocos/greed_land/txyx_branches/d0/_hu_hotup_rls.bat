
if "%hotup_pause%"=="" (
	set hotup_pause=true
)

python _hu_up_version.py false android
call %~dp0\_hu_version.bat

rem 设置热更新地址
set HOT_UPDATE_URL=https://txcgjsniu.wxknlm.com/

rem 生成热更新文件包
node _hu_version_generator.js -v %VERSION% -u %HOT_UPDATE_URL%

xcopy %~dp0\build\jsb-link\src\*.* %~dp0\hotupdate\%VERSION%\src /s
xcopy %~dp0\build\jsb-link\assets\*.* %~dp0\hotupdate\%VERSION%\assets /s


if "%hotup_pause%"=="true" (
	pause
)

