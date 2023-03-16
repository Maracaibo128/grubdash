const { PORT = 5000 } = process.env;

const path = require("path");

const app = require(path.resolve(
  `${process.env.SOLUTION_PATH || ""}`,
  "src/app"
));

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);


// Here's my entry point for running the application.  PORT is getting set to 5000 if the environment variable is not set.