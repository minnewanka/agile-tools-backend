# Agile application for backend

This backend is developped in NodeJS with MongoDB database
## Requirements

For building and running the application you need:

- [NodeJS LTS](https://nodejs.org/en/download/)
- [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/)

For visualizing the datas from the database :

- [MongoDB Compass](https://docs.mongodb.com/compass/master/install/)

## How and start the MongoDB database

After you installed these two softwares, you have to create the data directory where datas will be stored locally.

By default, the directory path is *\data\db*. You can use this path or use your own. 

For example : *c:/dev/mongodb/agile*

If you use the default path, then just run the command line :

  ```shell
  "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"
  ```

If you use your own path, run the command line :

  ```shell
  "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:/dev/mongodb/agile"
  ```

## Importing JSON file into MongoDB database

You need to import datas to your local MongoDB database.

Theses files are located in *agile-backend/res*.

Run the command line :

  ```shell
  "C:\Program Files\MongoDB\Server\4.0\bin\mongoimport.exe" --db agile --collection session  --type json --file public/json/session.json --jsonArray
  ```

## Running the application locally

1. You have to make sure that you have installed all packages :

    ```shell
    npm install

2. Run the command line :

    ```shell
    npm run dev