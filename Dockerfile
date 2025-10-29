FROM node:16-alpine

# Install necessary dependencies
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
        build-base \
        python3 \
        git && \
    if [ ! -e /usr/bin/python ]; then ln -s /usr/bin/python3 /usr/bin/python; fi

# Install necessary dependencies
RUN npm install -g node-gyp 


WORKDIR /app

COPY package.json package-lock.json ./


RUN npm install

RUN npm uninstall vue-template-compiler \
    && npm i -D @vue/compiler-sfc \
    && npm install vue-loader@next \
    && npm install vue-template-compiler

COPY . .

RUN npm run build

EXPOSE 8080

RUN npm install -g serve

CMD ["serve", "-s", "dist"]