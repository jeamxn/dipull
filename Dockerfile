FROM node:18-alpine
COPY . /app
WORKDIR /app

RUN yarn
RUN yarn build

CMD ["yarn","start"]
