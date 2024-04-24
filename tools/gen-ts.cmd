ECHO Generating typescript file from protobuf

call node_modules/.bin/pbts -o generated/bundle.d.ts generated/bundle.js
call node_modules/.bin/prettier --write generated/bundle.d.ts