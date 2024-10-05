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
- backend.py holds the main way to authe
