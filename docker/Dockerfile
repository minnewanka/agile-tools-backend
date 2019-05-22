FROM node:latest

COPY ./agile-backend.zip /home/agile-backend.zip
RUN apt-get update

# Installation des packages requis
RUN unzip ./home/agile-backend.zip -d /home/agile-backend/

WORKDIR /home/agile-backend/
RUN npm install
EXPOSE 1337
EXPOSE 587 
CMD [ "npm", "run", "start" ]
