@echo off
REM Build script for combined frontend + backend deployment on Windows

echo === Building ProductHub ===

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Build frontend
echo Building frontend...
cd frontend
call npm install
call npm run build
cd ..

REM Copy frontend build to root dist folder
echo Copying frontend build...
if exist dist rmdir /s /q dist
xcopy /s /i frontend\dist dist

echo === Build complete ===
pause
