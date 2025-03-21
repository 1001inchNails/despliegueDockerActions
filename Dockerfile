FROM node:16-bullseye
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]
