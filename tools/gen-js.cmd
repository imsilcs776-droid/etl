ECHO Generating typescript file from protobuf

call node_modules/.bin/pbjs -t static-module -w commonjs -o generated/bundle.js protobufs/*.proto
call node_modules/.bin/prettier --write generated/bundle.js