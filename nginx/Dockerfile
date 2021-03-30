FROM nginx:1.19.8-alpine

RUN set -x ; \
  addgroup -g 82 -S www-data ; \
  adduser -u 82 -D -S -G www-data www-data && exit 0 ; exit 1

COPY fullchain.pem /etc/fullchain.pem
COPY privkey.pem /etc/privkey.pem
COPY dhparam.pem /etc/dhparam.pem
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN nginx -t
