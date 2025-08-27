@echo off
setlocal

:: Carpeta del juego
cd /d "C:\Users\redos\Documents\juego_web"

:: Detectar IP local automáticamente
for /f "tokens=2 delims=:" %%f in ('ipconfig ^| findstr /c:"IPv4"') do (
    set ip=%%f
)
set ip=%ip:~1%

:: Mostrar dirección para el móvil
echo.
echo Tu servidor ya esta funcionando.
echo Abre esta direccion en tu movil: http://%ip%:5500
echo (Asegurate de estar en la misma red WiFi)
echo.

:: Lanzar servidor local con Python
python -m http.server 5500

pause
