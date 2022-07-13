
python _hu_up_version.py true android

call %~dp0\_hu_version.bat

rem 更新游戏默认配置的版本号
python _hu_apk_1_Ver_gmver.py %VERSION%

pause
