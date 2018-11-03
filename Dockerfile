ARG env
FROM mhart/alpine-node:latest as base
WORKDIR /usr/src/server
COPY ["./nginx.conf", "./default", "./"]
RUN echo -e "http://nl.alpinelinux.org/alpine/v3.5/main\nhttp://nl.alpinelinux.org/alpine/v3.5/community" > /etc/apk/repositories
RUN apk add --no-cache nginx && adduser -D -g 'www' www && mkdir /run/nginx && \
  mkdir /etc/nginx/sites-available && mkdir /etc/nginx/sites-enabled && \
  rm /etc/nginx/conf.d/default.conf && \
  yes | cp -rf ./nginx.conf /etc/nginx/ && cp ./default /etc/nginx/sites-available && \
  ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default && \
  apk add --no-cache certbot && mkdir /var/www/weatherservice

COPY ["./package.json", "./yarn.lock", "./"]

FROM base as development-build
RUN yarn install --development

FROM base as production-build
COPY --from=development-build /usr/src/server/node_modules ./node_modules
RUN yarn global add pm2

FROM ${env}-build
COPY . .
ARG env
ENV env=${env}
CMD [ "./run.sh" ]
