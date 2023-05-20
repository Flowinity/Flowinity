# syntax=docker/dockerfile:1

FROM node:18-alpine
RUN apk update && apk add git tesseract-ocr
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile --production
RUN yarn build
RUN yarn global add sequelize-cli mariadb
CMD ["node", "out/cluster.js"]
EXPOSE 34582
