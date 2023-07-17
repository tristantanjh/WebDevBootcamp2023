const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/WikiDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title must be included"]
      },
      content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find()
            .then((articles) => {
                res.send(articles);
            })
            .catch((err) => res.send("Error: " + err));
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save()
            .then(() => res.send("Successfully saved article."))
            .catch((err) => res.send("Error: " + err));
    })
    .delete((req, res) => {
        Article.deleteMany()
            .then(() => res.send("Successfully deleted all articles."))
            .catch((err) => res.send("Error: " + err));
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle})
            .then((article) => {
                if (article) {
                    res.send(article);
                } else {
                    res.send("No article with that title found.");
                }
            })
            .catch((err) => res.send("Error: " + err));
    })
    .put((req, res) => {
        Article.replaceOne({title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content})
            .then(() => res.send("Article successfully replaced."))
            .catch((err) => res.send("Error: " + err));
    })
    .patch((req, res) => {
        Article.updateOne({title: req.params.articleTitle}, 
            {$set: req.body})
            .then(() => res.send("Article successfully updated."))
            .catch((err) => res.send("Error: " + err));
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle})
            .then(() => res.send("Successfully deleted article."))
            .catch((err) => res.send("Error: " + err));
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});