# Pizza flow explained step by step:
First we need to use for our mock project some mock json data so we can seed-populate our database with our pizza products.That means we need to use `fs` from `node_modules` library to read the data.json that includes all the pizzas available. We will use the `readFileSync` method and for that reason it will be at the top of our file so it doesnt block our code, so first it reads the file, then we parse it and then we can do staff with this data.

## We create and export `showAllPizzas` controller:
Inside the controller we use the showPizzasb service which does the heavy work.We use  the mongoDb method `.find()` on `Pizza` model we created, to find all pizzas available.If there is no pizzas, we throw our custom  `AppError` otherwise we return the pizzas which found.These pizzas are attached in response object of the `showAllPizzas` controller that are send as a response in frontend.

### In general we follow these patterns:
- **Thin Controllers:** Controllers only handle HTTP (extracting params, sending JSON, etc). 
- **Fat Services:** All MongoDB queries and data transformations happen in `pizzaServices.js`.
- **Async Safety:** Every controller is wrapped in `catchAsync`, removing the need for `try/catch` blocks.