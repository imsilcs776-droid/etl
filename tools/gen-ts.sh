echo "Generating typescript file from protobuf"

./node_modules/.bin/pbts -o generated/bundle.d.ts generated/bundle.js
./node_modules/.bin/prettier --write generated/bundle.d.ts
