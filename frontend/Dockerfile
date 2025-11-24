FROM --platform=linux/amd64 node:22-bullseye

WORKDIR /app

COPY package*.json ./
COPY vite.config.ts ./
COPY index.html ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]