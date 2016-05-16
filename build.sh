#/bin/sh
rm output/*
tsc -p .
cat output/* > semaea.js