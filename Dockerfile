FROM node:18 as BUILDER
WORKDIR /usr/src/build

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build --omit=dev

FROM node:18-buster
WORKDIR /usr/src/app

RUN apt update
RUN apt install -y lsb-release
RUN curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list
RUN apt update
RUN apt install -y redis

COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
COPY --from=BUILDER /usr/src/build/build ./public

EXPOSE 3000
CMD service redis-server start && npm start
