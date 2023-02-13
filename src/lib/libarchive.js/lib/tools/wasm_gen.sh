if [ ! -f "./package.json" ]; then echo "you should run this from project root"; exit 1; fi
docker run -it -v `pwd`:/var/local libarchive-llvm