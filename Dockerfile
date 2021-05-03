# build image
FROM node:14-alpine as build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci --only=production

FROM node:14-alpine as uibuild
WORKDIR /usr/src/app/ui
COPY package*.json /usr/src/app/ui/
RUN npm install

# run image
FROM node:14-alpine
RUN apk add dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=uibuild /usr/src/app/ui/node_modules /usr/src/app/ui/node_modules
COPY --chown=node:node . /usr/src/app
RUN npm run build
ENV NODE_ENV production
EXPOSE 8080
CMD ["dumb-init", "npm", "start" ]