FROM node:16-alpine

WORKDIR /ASSIGNMENT/
COPY ./package.json /ASSIGNMENT/
COPY ./yarn.lock /ASSIGNMENT/
RUN yarn install

RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY . /ASSIGNMENT/

CMD yarn start:dev
# RUN yarn build
# CMD yarn start
