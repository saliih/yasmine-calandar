echo Nyellow deploy...
echo clearing cache...

:; if [ -z 0 ]; then
  @echo off
  goto :WINDOWS
fi

rm -rf app/cache
if [ ! -z $1 ]
then
    env=$1
else
    env=dev
fi
php app/console assets:install --symlink
mkdir -p web/fonts
cp web/bundles/app/fonts/* web/fonts
#exiting the bash part and then WINDOWS part
php app/console assetic:dump --env=%env%
exit

:WINDOWS
IF exist app\cache\ ( rd /S /Q app\cache )
SET env=%1
IF "%env%"=="" SET env=dev
php app/console assets:install --symlink
mkdir web\fonts
xcopy web\bundles\app\fonts\* web\fonts /Y
php app/console assetic:dump --env=%env%
