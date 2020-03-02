# Prep&Groc server with microservices

Prep&Groc server with microservices is the same server-side application of the Prep&Groc project except that it uses microservice principles and guidelines.
It has the following services:
- API Gateway: runs on **express** server and is responsible for user authentication and proxying user requests to specific services.
    - Uses **http-proxy-middleware** library to proxy user requests.
    - Uses **authenticate** middleware to authenticate users.
- Users service: responsible for user accounts registration and user login.
- Recipes service: responsible for recipes and user collection of recipes.
- User ingredients service: responsible for user fridge ingredients and grocery items management.

## Running instructions (Development mode only)
### From root repository
- Use Docker compose to build and start running images of services with ```docker-compose up``` command.
### From service root repository
- Start running a service locally with ```npm run dev:local-server``` command.

You can find more about Prep&Groc at [application repository page ](https://github.com/LumbardhAgaj/prep-and-groc 'Prep&Groc application repository page').
