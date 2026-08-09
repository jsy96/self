@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  update-activities.bat
REM  Sync WaytoAGI activities from Feishu wiki into activities.json,
REM  then auto commit and push to remote.
REM
REM  Usage:
REM    update-activities.bat         -> sync + git commit + push
REM
REM  Prerequisite: lark-cli user auth must be valid.
REM    Check:   lark-cli auth status
REM    Refresh: lark-cli auth login --domain all
REM ============================================================

cd /d "%~dp0"

echo.
echo === Step 1/2: Syncing & discovering activities from Feishu wiki ===
node sync-activities.js --discover
if errorlevel 1 (
    echo.
    echo [ERROR] sync failed. lark-cli user auth may be expired.
    echo Run: lark-cli auth status
    echo Then: lark-cli auth login --domain all
    pause
    exit /b 1
)

echo.
echo === Step 2/2: Committing and pushing ===
git add activities.json
git diff --cached --quiet
if not errorlevel 1 (
    echo [INFO] Nothing to commit. activities.json unchanged.
) else (
    for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "TS=%%i"
    git commit -m "chore: sync waytoagi activities !TS!"
    if errorlevel 1 (
        echo [ERROR] git commit failed.
        pause
        exit /b 1
    )
    git push origin master
    if errorlevel 1 (
        echo [ERROR] git push failed.
        pause
        exit /b 1
    )
    echo [DONE] Synced and pushed.
)

echo.
pause
endlocal
