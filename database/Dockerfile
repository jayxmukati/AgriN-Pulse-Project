FROM postgis/postgis:15-3.4

RUN apt-get update && apt-get install -y \
    postgresql-server-dev-15 \
    gcc \
    make \
    git \
    clang-13 \
    llvm-13 \
    && git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make \
    && make install \
    && cd .. \
    && rm -rf pgvector \
    && apt-get remove -y gcc make git postgresql-server-dev-15 clang-13 llvm-13 \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
