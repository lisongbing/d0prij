
set PROJ_DIR=%~dp0.
set BUILD_DIR=%PROJ_DIR%\build\jsb-link\

call %~dp0\_hu_version.bat

for /f "tokens=1-2 delims=." %%a in ("%VERSION%") do (
	set BUILD_VERSION=%%a.%%b
)

rem 修改main.js
python _hu_apk_3_Prj_mainjs.py %BUILD_DIR% %BUILD_VERSION% android debug

pause
