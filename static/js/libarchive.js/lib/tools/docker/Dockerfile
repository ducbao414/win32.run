FROM trzeci/emscripten

WORKDIR /opt

ADD https://github.com/libarchive/libarchive/releases/download/v3.4.0/libarchive-3.4.0.zip /opt
ADD https://github.com/madler/zlib/archive/v1.2.11.zip /opt
ADD https://netix.dl.sourceforge.net/project/lzmautils/xz-5.2.4.tar.gz /opt
ADD https://netix.dl.sourceforge.net/project/bzip2/bzip2-1.0.6.tar.gz /opt
ADD https://www.openssl.org/source/openssl-1.0.2s.tar.gz /opt

RUN unzip /opt/libarchive-3.4.0.zip && rm /opt/libarchive-3.4.0.zip && \
    unzip /opt/v1.2.11.zip && rm /opt/v1.2.11.zip && \
    tar xf /opt/xz-5.2.4.tar.gz && rm /opt/xz-5.2.4.tar.gz && \
    tar xf /opt/bzip2-1.0.6.tar.gz && rm /opt/bzip2-1.0.6.tar.gz && \
    tar xf /opt/openssl-1.0.2s.tar.gz && rm /opt/openssl-1.0.2s.tar.gz

RUN apt-get update && \
    apt-get install -y locate vim file

ENV CPPFLAGS "-I/usr/local/include/ -I/opt/zlib-1.2.11 -I/opt/bzip2-1.0.6 -I/opt/openssl-1.0.2s/include -I/opt/openssl-1.0.2s/test"
ENV LDLIBS "-lz -lssl -lcrypto"
ENV LDFLAGS "-L/usr/local/lib"

# compile openSSL to LLVM
WORKDIR /opt/openssl-1.0.2s
RUN cd /opt/openssl-1.0.2s && emmake bash -c "./Configure -no-asm -no-apps no-ssl2 no-ssl3 no-hw no-deprecated shared no-dso linux-generic32" && \
    sed -i 's/CC= $(CROSS_COMPILE)\/emsdk_portable\/sdk\/emcc/CC= $(CROSS_COMPILE)cc/' Makefile && \
    emmake make && \
    cd /usr/local/lib && \
    ln -s /opt/openssl-1.0.2s/libssl.a && \
    ln -s /opt/openssl-1.0.2s/libcrypto.a

# compile LZMA to LLVM
WORKDIR /opt/xz-5.2.4
RUN cd /opt/xz-5.2.4 && emconfigure ./configure --disable-assembler --enable-threads=no --enable-static=yes 2>&1 | tee conf.out && \
    emmake make 2>&1 | tee make.out && emmake make install

# compile libarchive to LLVM
WORKDIR /opt/libarchive-3.4.0
RUN cd /opt/libarchive-3.4.0 && emconfigure ./configure --enable-static --disable-shared --enable-bsdtar=static --enable-bsdcat=static \
    --enable-bsdcpio=static --enable-posix-regex-lib=libc \
    --disable-xattr --disable-acl --without-nettle --without-lzo2 \
    --without-cng  --without-lz4 \
    --without-xml2 --without-expat 2>&1 | tee conf.out && \
    emmake make 2>&1 | tee make.out && emmake make install

#--without-openssl
#--without-bz2lib --without-iconv --without-libiconv-prefix --without-lzma 

WORKDIR /var/local/lib/tools
CMD ["bash","/var/local/lib/tools/build.sh"]