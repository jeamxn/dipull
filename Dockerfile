FROM node:18-alpine

RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY . /app
WORKDIR /app

ARG KAKAO_REST_API_KEY
ARG MOGODB_URL
ARG KAKAO_REDIRECT_URI

RUN yarn
RUN yarn build

CMD ["yarn","start"]
