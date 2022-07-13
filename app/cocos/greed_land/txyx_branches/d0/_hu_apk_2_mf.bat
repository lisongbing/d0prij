
python _hu_apk_2_mf.py android

set hotup_pause=false

call %~dp0\_hu_hotup.bat

set HOT_UPDATE_VERSION_PATH=%~dp0\hotupdate\%VERSION%\
set ASSETS_DIR=%~dp0\assets

copy %HOT_UPDATE_VERSION_PATH%\project.manifest %ASSETS_DIR%\resources\
copy %HOT_UPDATE_VERSION_PATH%\version.manifest %ASSETS_DIR%\resources\

pause
