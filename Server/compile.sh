#!/bin/bash

PATH_TO_SCRIPT=$(cd ${0%/*} && pwd -P)
cd $PATH_TO_SCRIPT

echo $PATH_TO_SCRIPT

npm install

rm -rf bin

# Client code compile
coffee --compile --output bin/res/static/js src/client/*.coffee
coffee --compile --output bin/test/client test/client/*.coffee

#Server code compile
coffee --compile --output bin/src/server src/server/*.coffee
coffee --compile --output bin/test/server test/server/*.coffee

cp res bin -R