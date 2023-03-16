const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const ordersRouter = require("./orders/orders.router");
const dishesRouter = require("./dishes/dishes.router");

const app = express();

// You have not learned about CORS yet.
// The following line let's this API be used by any website.
app.use(cors());

app.use(express.json());
// The express.json() function is a built-in middleware that adds a BODY property to the request (req.body).  The req.body request will contain the parsed data - or it will return an empty object if there was no body to parse, the Content-Type wasn't matched, or an error occurred.

app.use("/dishes", dishesRouter);
app.use("/orders", ordersRouter);

// }

// app.get('/example/c', [cb0, cb1, cb2])


app.use(notFound);

app.use(errorHandler);

module.exports = app;
