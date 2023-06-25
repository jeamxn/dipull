FROM node:18-alpine
COPY . /app
WORKDIR /app

ARG KAKAO_REST_API_KEY
ARG MOGODB_URL
ARG KAKAO_REDIRECT_URI

RUN yarn
RUN yarn build

CMD ["yarn","start"]
