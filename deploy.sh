#!/bin/sh

echo Deploying to AppEngine..
c:/dev/Python27/python "C:/Program Files (x86)/Google/google_appengine/appcfg.py" --oauth2 update build

echo
echo Done!
echo
