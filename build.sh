#/bin/sh
rm output/*
tsc -p .
rm semaea.js
# concatenate output files, ordered by modification time to have class definitions 
# ordered according to files array in tsconfig.json, to one output file 
for i in `ls -tr output/`; do cat "output/$i" >> semaea.js; done
