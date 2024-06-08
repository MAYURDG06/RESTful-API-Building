const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

//////////request targetting all articles//////////

app.route("/articles")

.get(function(req,res){
    Article.find().then(function(foundArticles){
        res.send(foundArticles)
    })
    .catch(function(err){
        res.send(err)
    })
})

.post(function(req,res){
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if (!err){
            res.send("successfully added a new article.")
        }
    })
})

.delete(function(req,res){
    Article.deleteMany().then(function(){
        res.send("successfully deleted all articles")
    })
    .catch(function(err){
        res.send(err)
    })
}) 

//////////requests targetting a specific article//////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if (foundArticle) {
            res.send(foundArticle)
        } else {
            res.send("No articles matching that title was found")
        }
    })
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
    ).then(function(err){
        if (!err) {
            res.send("successfully upadated an article")
        }
    })
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then(function(err){
       if (!err){
        res.send("successfully updated an article")
       } else{
        res.send(err)
       }
    })
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle}
    ).then(function(err){
        if (!err) {
            res.send("deleted article successfully")
        }
    })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});