FROM node:18 as BUILDER
WORKDIR /usr/src/build

COPY ./package*.json .
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD npm start