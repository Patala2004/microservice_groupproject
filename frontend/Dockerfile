FROM --platform=linux/amd64 node:22-bullseye

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY index.html ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]