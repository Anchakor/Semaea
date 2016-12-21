#/bin/sh
#rm -r output/*
tsc -p . && \
node node_modules/requirejs/bin/r.js -o baseUrl=output name=Main out=output/semaea_client.js optimize=none
