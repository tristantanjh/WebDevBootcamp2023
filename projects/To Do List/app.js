const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { type } = require("os");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Groceries", "Do Laundry"];
const workItems = [];

app.get("/", function(req, res) {
    res.render("list", {typeOfList: date.getDate(), arrNewItems: items});
});

app.get("/work", function(req, res) {
    res.render("list", {typeOfList: "To-Do For Work", arrNewItems: workItems});
});

app.post("/", function(req, res) {
    const item = req.body.addList;
    const typeOfList = req.body.whichList;
    if (typeOfList == "To-Do") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
})

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});
