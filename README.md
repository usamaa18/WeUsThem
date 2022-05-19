## Design Overview

The front end was built using React, with Bootstrap for styling.
The back end was built using Node/Express.
The database was MongoDB/Mongoose.

There are 4 API endpoints that are used to connect the front and back end.

`GET /items` - returns a list of contacts
`POST /contacts` - to create a new contact
`POST /contacts/:id` - to edit a given contact
`DELETE /contacts/:id` - to delete a given contact

The images uploaded are stored on the server's static folder and a reference to their location is stored in the database. A better solution would be to upload them AWS S3, and store the link in the database.

## Instructions

Setup MongoDB Atlas (locally or remote)

Create a .env file in the api folder and add:

    MONGODB_URI=<your-mongodb-uri-here>

In one terminal 

    cd api
    npm install
    npm start

In a seperate terminal 

    cd client
    npm start

 