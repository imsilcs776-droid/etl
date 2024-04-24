ECHO Generating typescript file from protobuf

call node_modules/.bin/pbjs -t json protobufs/*.proto > generated/bundle.json