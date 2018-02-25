var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;
var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));


mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/MongoHW", {
  useMongoClient: true
});

// GET route for scraping
app.get("/scrape", function(req, res) {
  
  axios.get("https://www.huffingtonpost.com/section/us-news").then(function(response) {
    
    var $ = cheerio.load(response.data);
    $("a.card__link").each(function(i, element) {
      // Where results will be pushed
      var result = {};

      result.title = $(this)
        .text();
      result.link = $(this)
        .attr("href");

      //Add article to the database
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

    res.send("Scrape Complete");
  });
});

// GET route to retrieve articles
app.get("/articles", function(req, res) {

  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get route for getting specific article
app.get("/articles/:id", function(req, res) {
  
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Post route for saving note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
