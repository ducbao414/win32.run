emcc ../wrapper/main.c -I /usr/local/include/ -o ../build/main.o #-g4

emcc ../build/main.o /usr/local/lib/libarchive.a /usr/local/lib/liblzma.a /usr/local/lib/libssl.a /usr/local/lib/libcrypto.a \
    -o ../build/libarchive.js \
    -s USE_ZLIB=1 -s USE_BZIP2=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME=libarchive -s WASM=1 -O3 -s ALLOW_MEMORY_GROWTH=1 \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap","allocate","intArrayFromString"]' -s EXPORTED_FUNCTIONS=@$PWD/lib.exports -s ERROR_ON_UNDEFINED_SYMBOLS=0

cp ../build/libarchive.js ../../src/webworker/wasm-gen/
cp ../build/libarchive.wasm ../../src/webworker/wasm-gen/

echo Done
