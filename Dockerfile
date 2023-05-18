# syntax=docker/dockerfile:1

FROM node:18-alpine
RUN apk update && apk add git
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile --production
RUN yarn build
# package doesn't install from package.json for some reason
RUN yarn add wrap-ansi@7
CMD ["node", "out/cluster.js"]
EXPOSE 34582
