echo "Generating javascript file from protobuf"

./node_modules/.bin/pbjs -t static-module -w commonjs -o generated/bundle.js protobufs/*.proto
./node_modules/.bin/prettier --write generated/bundle.js
