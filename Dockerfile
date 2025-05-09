FROM node:14.15 AS build

ARG APP_ENV
ENV SERVER=
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm cache clean --force
RUN npm i

COPY . .

RUN npm run build:ssr:${APP_ENV}

# CMD [ "node", "dist/${SERVER}/server/main.js" ]
CMD node "dist/${SERVER}/server/main.js"
