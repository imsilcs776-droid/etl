# ----------- Build Stage -----------
FROM node:22-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build NestJS app
COPY . .
RUN yarn build


# ----------- Production Stage -----------
FROM node:22-bullseye-slim

# Install required Oracle Instant Client dependencies
RUN apt-get update && apt-get install -y \
    curl unzip libaio1 libnsl-dev libxi6 libxrender1 libxtst6 \
    && rm -rf /var/lib/apt/lists/*

# Install Oracle Instant Client BasicLite
ENV ORACLE_VERSION=21_11
WORKDIR /opt/oracle
RUN curl -O https://download.oracle.com/otn_software/linux/instantclient/2111000/instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip && \
    unzip instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip && \
    rm instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip && \
    ln -s /opt/oracle/instantclient_${ORACLE_VERSION} /opt/oracle/instantclient && \
    ln -s /opt/oracle/instantclient/*.so /usr/lib/

# Set Oracle environment variables
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

# Set working directory for app
WORKDIR /app

# Copy only runtime deps and built code
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist

# Default command to run app
CMD ["node", "dist/main.js"]
