@echo off
set "hash=%~1"


if "%hash%"=="" (
    echo Error: No commit hash provided. Exiting.
    goto :eof
)

if "%hash%"=="main" (
    git checkout main

    git rev-parse --abbrev-ref HEAD
    goto :eof
)

rem Force delete the branch if it already exists, hiding errors if it doesn't
git branch -D old-%hash% >nul 2>&1

git checkout -b old-%hash% %hash%

if errorlevel 1 (
    echo Error: Failed to create or switch to branch "old-%hash%". Exiting.
    goto :eof
)

git rev-parse --abbrev-ref HEAD