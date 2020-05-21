FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm i

COPY . /app

EXPOSE 8081

CMD node index.js