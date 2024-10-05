# What we learned

_Tomas and Jaden_

## General:

- This codebase has three focused folders: deployment, django_project, playwright
- Django_project holders the actual django project (duh), with routing views, urls and frontend pages included
- There is also the authentication, migration of the authentication (like making changes to the authentication/database live) and api calls
- .gitignore, ignores pushing .env and other files to github/git in general
- .env is the file where environment variables are stored, these are secrets (like api keys) that cannot be leaked, so they are kept in the file and accessed using variables through a library (not sure if they use dotenv).
- In the actual platform, these are stored in a hidden way
- Playwright holds tests, it’s basically like programmatically performing actions and then checking the result (if they match, then perfect!)
- Deployment folder with nginx and docker seems quite clear, as they are tools to help the process of deploying the web app (though the tools themselves are not)
- Docker puts all dependencies and needed libraries into a container, that is like it’s own self-contained environment, and then can be run on any os
- Nginx just helps the routing and allows publishing on a web server (I think?)

## django_project/azure_auth/ :

- This is the authentication of geosight for the user, to ensure no malicious actions are performed on the site
- The azure auth (also sometimes easy auth) is just a service that allows easy authentication and logins
- It uses restful api
- This folder is it’s own sub app, as it holds its own views and urls
- The utils is like the utilities that the authentication can use
- backend.py holds the main way to authenticate the user
- It uses json web tokens, so that api requests in the future can be authenticated with the users session token
- There’s also an ensure user is truly user and has all their information function
- There are many functions that all work together to authenticate the user, ensure the user is logged in and has a valid JWT
- This is where user sessions can be maintained, by keeping the JWT token with the user
- middleware.py intercepts requests to ensure that user authentication is valid before continuing with what they’re doing
- It checks whether there is a valid Azure B2C token, and allows user to continue their action if it is valid
- if middleware finds a token, it sends it to backend.py to verify it. Once verified, backend gives control back to middleware which allows the user to access the view
- If invalid, it logs user out and redirects them to login page
- The other folders have similar systems, just different purposes
- models.py holds schemas or models for data types
- To make a new database object (new schema), you can create a new model

## django_project/azure_auth/migrations/ :

- Migrations holds all the active setups of the database
- You can make migrations (when the database is changed via django admin) and migrate
- This sets up the initial database schema and data

## django_project/core/api/ :

- These are where all the endpoints are stored? Where you can query data
- There are functions that return database information (includes CRUD), so I assume this is the actual api endpoints and database molding portion
- This is where you can query and alter the data in the database
- Users can be somewhat maintained in the user file, where they can be altered and changed
