# syntax=docker/dockerfile:1

FROM node:18-alpine
RUN apk update && apk add git tesseract-ocr tesseract-ocr-data-eng
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build
RUN yarn global add sequelize-cli mariadb
RUN cd frontend && yarn install --frozen-lockfile && yarn build && mv dist ../frontend_build
CMD ["node", "out/cluster.js"]
EXPOSE 34582
EXPOSE 34583
