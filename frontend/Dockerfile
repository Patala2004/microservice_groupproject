FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm rebuild

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
