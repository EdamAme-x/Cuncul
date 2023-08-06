@echo off
setlocal

set "port=8000"

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%port%"') do (
    taskkill /f /pid %%a
    echo ポート %port% のプロセスを終了しました。
    exit /b
)

echo ポート %port% で実行中のプロセスはありません。