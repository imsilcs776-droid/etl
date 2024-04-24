echo "Generating json file from protobuf"

./node_modules/.bin/pbjs -t json protobufs/*.proto > generated/bundle.json
