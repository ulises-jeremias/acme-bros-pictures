FROM node:12.16 AS development

WORKDIR /usr/src/app

COPY yarn.lock .
COPY package.json .

RUN yarn

ENTRYPOINT ["yarn"]
CMD ["dev"]


FROM node:12.16-alpine AS builder

WORKDIR /usr/src/builder

COPY yarn.lock .
COPY package.json .

RUN yarn

COPY . .

RUN yarn build


FROM node:12.16-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/builder/dist ./dist
COPY yarn.lock .
COPY package.json .

RUN yarn --production

EXPOSE 3000

ENTRYPOINT ["yarn"]
CMD ["start"]
