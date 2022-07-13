
set PROJ_DIR=%~dp0.
set BUILD_DIR=%PROJ_DIR%\build\jsb-link\

call %~dp0\_hu_version.bat

for /f "tokens=1-2 delims=." %%a in ("%VERSION%") do (
	set BUILD_VERSION=%%a.%%b
)

set APK_NAME=GreedLand_dbg_%BUILD_VERSION%.apk

set APK_PATH=%BUILD_DIR%\frameworks\runtime-src\proj.android-studio\app\build\outputs\apk\debug\%APK_NAME%
if exist %APK_PATH% (
	del %APK_PATH%
)

ren %BUILD_DIR%\frameworks\runtime-src\proj.android-studio\app\build\outputs\apk\debug\GreedLand-debug.apk %APK_NAME%

copy %BUILD_DIR%\frameworks\runtime-src\proj.android-studio\app\build\outputs\apk\debug\%APK_NAME% %BUILD_DIR%\frameworks\runtime-src\proj.android-studio\app\build\outputs\apk\debug\GreedLand-debug.apk 

pause

