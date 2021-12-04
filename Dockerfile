FROM node

COPY package*.json ./

RUN npm install 

COPY . .

WORKDIR src