#!/bin/bash

npm install

coffee --compile --output ./bin *.coffee
coffee --compile --output ./bin/static/js client_code/*.coffee

cp views ./bin -R
cp static ./bin -R

node bin/starter.js