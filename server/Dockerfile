FROM node:alpine AS builder

WORKDIR /usr/src/builder

COPY yarn.lock .
COPY package.json .

RUN yarn

COPY . .

RUN yarn build

FROM node:alpine AS run

WORKDIR /usr/src/app

COPY --from=builder /usr/src/builder/dist ./dist
COPY yarn.lock .
COPY package.json .

RUN yarn --production

EXPOSE 3000

ENTRYPOINT ["yarn"]
CMD ["start"]
