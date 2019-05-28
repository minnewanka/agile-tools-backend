FROM node:latest

COPY ./agile-backend.zip /home/agile-backend.zip
RUN apt-get update

# Installtion postfix
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends postfix bsd-mailx

# Installation des packages requis
RUN unzip ./home/agile-backend.zip -d /home/agile-backend/

WORKDIR /home/agile-backend/
RUN npm install
EXPOSE 587 1337
CMD [ "npm", "run", "start" ]
