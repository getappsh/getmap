# Multistage Dockerfile to build a node application

FROM node:19.5.0-alpine
USER root
WORKDIR /node-app
COPY package.json package.json
RUN npm i
COPY . .
ENV CI=true
RUN npm run test
CMD [ "npm" , "run", "start:dev"]
