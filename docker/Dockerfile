FROM node:latest

COPY ./agile-backend-1.0.1-SNAPSHOT.zip /home/agile-backend.zip
RUN apt-get update

# Installation des packages requis
RUN unzip ./home/agile-backend.zip -d /home/agile-backend/

WORKDIR /home/agile-backend/
RUN npm install
EXPOSE 1337 
CMD [ "npm", "run", "start" ]
