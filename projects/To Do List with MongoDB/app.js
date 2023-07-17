const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-tristan:test123@cluster0.irrguae.mongodb.net/toDoListDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be included"]
    },
    items: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Welcome to your To-Do List!"
});

const item2 = new Item({
    name: "Hit the + button to addd a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const itemsArr = [item1, item2, item3];

app.get("/", function(req, res) {
    const day = date.getDate();
    Item.find()
        .then((items) => {
            if (items.length === 0) {
                Item.insertMany(itemsArr)
                    .then(() => {
                        console.log("Default items added");
                        res.redirect("/");
                    })
                    .catch((err) => console.error("Error: ", err));
            } else {
                res.render("list", {listTitle: day, newListItems: items});
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item({
        name: itemName
    });

    if (listName === date.getDate()) {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName})
            .then((foundList) => {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
});

app.post("/delete", (req, res) => {
    const deleteItemID = req.body.deleteItem;
    const listName = req.body.listName;

    if (listName === date.getDate()) {
        Item.deleteOne({_id: deleteItemID})
        .then(() => console.log("item deleted"))
        .catch((error) => console.error('Error:', error));

        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName}, 
            {$pull: {items: {_id: deleteItemID}}})
            .then((up) => console.log("item deleted"))
            .catch((error) => {
                console.error('Error:', error);
            });

        res.redirect("/" + listName);
    }


});

app.get("/:customRoute", (req, res) => {
    const customRoute = _.toLower(req.params.customRoute);
    List.findOne({name: customRoute})
        .then((l) => {
            if (l) { // find returns an array, findOne returns only 1 obj
                console.log("Found List");
                res.render("list", {listTitle: l.name, newListItems: l.items})
            } else {
                console.log("Does not exist");
                const list = new List({
                    name: customRoute,
                    items: itemsArr
                })
                list.save();
                res.redirect("/" + customRoute);
            }
        })
        .catch((error) => console.error('Error:', error));
})

app.get("/about", function(req, res){
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
