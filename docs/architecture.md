# The architecture of the PizzeriaGema project
This is my first project, so the architecure is not quite right, after explaining all the rest i will try to refactor all the architecture the correct way.

## The correct architecture:
This project is quite small so it is acceptable to just have folders like:


**1)Models:** In here we create our Schemas and based on them we create our models, like our Pizza model or User model.Also here we can create Mongoose middleware(`Pre/Post hooks`) above the creation of the model, that intercept requests and for example one middleware would be to hash a password and save it hashed in our database and not the original password for safety reasons.

**2)Controllers:** In here we create controllers for our pizzas and users, for example to create-update-delete-or just read a user or pizza.Controllers are there to manage the request response cycle and we try to avoid logic inside them, to keep them thin and clear and easy to understand.Logic should be inside services.

**3)Routes**:Here we keep organized all our routing and we connect our middlewares and controllers.

**4)Middlewares:** Here we keep the authentication, authorization,Error handling .

**5)Utils:** Here we store reusable functions(like tiny helpers) that usually solve a technical problem.We can reuse them even in other projects they way they are.

**6)Services:** Here we keep the bussiness logic. Services depend on Models/Databases or external APIs and usually they solve a bussiness problem(e.g `Register User`), services are never associated with req,res cycle.

**Everything from 1-6 we keep in src folder**(this is the engine room).Src folder is at root directory together with .env,.gitignore,package.json,app.js,server.js,public and node_modules.

**In public folder** we keep all the static file like index.html, styles.css, script.css and Express we serve this folder using `app.use(express.static('public))`.




### in case we guess the application will big:
Then we should have components.each component should represent a product domain like `user-component` , `order-component` etc.Each component has its own API,logic, and logical database.What is the merrit? With an autonomous component, every change is performed over a  smaller scope with the result of the mental overload, development friction and deployment fear are much smaller.
