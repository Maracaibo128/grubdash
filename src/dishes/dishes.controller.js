// This controller file is going to define and export the route-handler functions.  This file's single responsibility in an API is to manage the state of a single resource (for example, to create, read, update, delete, or list the requested data)

const path = require("path");
// the code imports the 'path` module to resolve the path to the `dishes-data.js` file.  for documentation, check out `nodejs.org/api/path.html and search for "path.resolve(["


// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

/*
CRUDL - create, read, update, delete, and list (index)



*/

// this one can be found in 35.6
function list(req, res, next) {
    res.json({ data: dishes })
    // property name must be "dishes"
}


// function validateDish(req, res, next) {
//     const { data: {name, description, price, image_url} = {} } = req.body;

//     const requiredFields = ["name", "description", "price", "image_url"];

//     for (const field of requiredFields) {
//         if (!req.body.data[field] || req.body.data[field] === "" ) {
//             return next({
//                 status: 400,
//                 message: `Dish must include a ${field}`,
//             });
//         }
//     }

//     if (typeof price !== "number" || price <= 0) {
//         return next({
//             status: 400,
//             message: `Dish must have a price that is an integer greater than 0`,
//         });
//     }

//     return next();
// }

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        // let's check if the propertyName is present in the data object of the request body, and also check if the price property is greater than 0.  if both conditions are true, then everything is hunky-dory and the middleware function calls `next()` to move on to the next middleware function in the chain.
        if (data[propertyName] && data["price"] > 0) {
            return next();
        }

        if (data["price"] < 1 || !data["price"]) {
            // if the `price` property is less than 1 or missing altogether, we can immediately call `next()` with an object that has a `status` property of 400 and a `message` property that describes the error.
            next({ 
                status: 400,
                message: `Dish must include a price`,
            })
            // if the price is fine but some other `propertyName` is missing:
        }
        next({ 
            status: 400,
            message: `Dish must include a ${propertyName}`,
        });
    };
}

function idMatches(req, res, next) {
    const { dishId } = req.params;
    const {
        data: { id },
    } = req.body;
    if (Number(id) === Number(dishId) || !id) {
        next();
    }
    next({
        status: 400,
        message: `Updated dish id must match current dish's id - id given: ${id} - correct id: ${dishId}`,
    });
}

function isNumber(req, res, next) {
    const dish = res.locals.dish;
    if (typeof dish.price !== "string") {
        return next();
    }
    next({
        status: 400,
        message: `Updated dish price must be a number`
    });
}

function create(req, res, next) {
    // TODO: validate request body
    // according to the instructions, i need to return error messages if any of the following are missing or empty: name, description, price, and image_url.
    // ...
    // create new dish and add to dishes array

    const { data: { name, description, price, image_url} = {} } = req.body;
    // this line uses destructuring. if the body doesn't contain a data property, the destructuring will still succeed because you have supplied a default value of {} for the data property

    const newDish = {
        id: nextId(), // use nextId to generate a new id
        name,
        description,
        price,
        image_url
    };
    dishes.push(newDish);
    // return new dish as JSON
    res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
    // first we are going to extract the dishId parameter from the request URL 
    const { dishId } = req.params;
    
    // then we are going to search the dishes array for a dish that has a matching id.  if a match is found, foundDish wil be set to that dish object
    const foundDish = dishes.find((dish) => dish.id === dishId);

    if (foundDish) {
        // save the dish in the res.locals.dish variable.  the res.locals object is used to pass data between middleware functions
        res.locals.dish = foundDish;
        return next();
    }
    next({
        // if no dish is found with the given dishId, pass an error to the next middleware function with a status code of 404 and a message that includes the dishId
        status: 404,
        message: `Dish id not found: ${dishId}`,
    });
}

function read(req, res) {
    // this will just return the found dish object in the response json data.  this is why res.locals object comes in handy
    res.json({ data: res.locals.dish });
}

function update(req, res, next) {
    const dish = res.locals.dish;
    const {dishId} = req.params;
    const {
        data: { id, name, description, price, image_url},
    } = req.body;

    if(id !== dishId) {
        next({status: 400})
    }

dish.name = name;
dish.description = description;
dish.price = price;
dish.image_url = image_url;
res.json({ data: dish })
}

module.exports = {
    list,
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        create,
    ],
    read: [
        dishExists, 
        read,
    ],
    update: [
        dishExists,
        idMatches,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        isNumber,
        update
    ]
    // TODO: add update and read handlers as well
};