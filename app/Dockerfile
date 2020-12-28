FROM node:latest

WORKDIR /usr/whichisp

COPY .*.js ./
COPY ./src ./src
COPY package.json ./
COPY tsconfig*.json ./

RUN npm install --silent
# RUN npm install pm2 -g --silent
RUN npm run build

COPY ./public ./public
COPY ./views ./views

COPY schema.sql ./app/
COPY clear.sql ./app/

EXPOSE 3000

CMD ["npm", "start"]