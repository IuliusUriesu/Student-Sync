FROM node:20.12.2

WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENV PORT=8080

EXPOSE 8080

CMD [ "npm", "start" ]