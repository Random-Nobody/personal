FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./

CMD ["npm", "run", "dev"]