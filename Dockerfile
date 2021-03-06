FROM node:10.8.0-alpine

LABEL Maintainer="Ivan Kipyegon"

ENV PORT 3003

ENV MONGO_URL mongodb://localhost:27017/fashion-cloud-db

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE ${PORT}

ENTRYPOINT [ "npm", "start" ]