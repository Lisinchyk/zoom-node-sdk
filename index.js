const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const routeServices = require('./services');

const app = express();
const PORT = process.env.PORT || 3444;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
}));


app.get("/", routeServices.start);
app.post("/zoomcall", routeServices.createHost);
app.post("/create", routeServices.create);
app.get("/join", routeServices.join);
app.get("/leave", routeServices.leave);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});