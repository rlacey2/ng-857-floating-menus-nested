echo off

nvm list

nvm use 24.15.0
echo delay needed for nvm above
timeout /t 3 
nvm list
 

npx ng build --aot --configuration production 

