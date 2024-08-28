FROM node:alpine

WORKDIR /shopper/backend

COPY package*.json ./
COPY *.env ./

RUN npm install && npm install -g @nestjs/cli

COPY . .