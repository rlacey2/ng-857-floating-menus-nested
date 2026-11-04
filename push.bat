@echo off
set "msg=%~1"
if "%msg%"=="" set "msg=Update"

git add .
git commit -m "%msg%: %date% %time%"
git push -f origin main 