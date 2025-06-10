# build environment
FROM node:21-alpine as build
LABEL maintainer="Nitin Kumar Chetwani <hnmn3.nitin@gmail.com>"

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./

RUN apk add --update --no-cache \
            chromium \
            nodejs \
            npm

# Do not use puppeteer embedded chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV CHROMIUM_PATH="/usr/bin/chromium-browser"
ENV PUPPETEER_EXECUTABLE_PATH="${CHROMIUM_PATH}"

RUN npm install
RUN npm install puppeteer --unsafe-perm=true --allow-root
COPY . ./

RUN npm run build

# production environment
FROM nginx:stable-alpine
LABEL maintainer="Nitin Kumar Chetwani <hnmn3.nitin@gmail.com>"

# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
