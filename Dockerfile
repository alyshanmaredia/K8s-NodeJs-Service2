FROM node:18
WORKDIR /processorapp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7000
CMD ["node", "index.js"]
