# Pizza flow explained step by step:
First we need to use for our mock project some mock json data so we can seed-populate our database with our pizza products.That means we need to use `fs` from `node_modules` library to read the data.json that includes all the pizzas available. We will use the `readFileSync` method and for that reason it will be at the top of our file so it doesnt block our code, so first it reads the file, then we parse it and then we can do staff with this data.

## We create and export `showAllPizzas`:
Firstly in our case we need to clarify