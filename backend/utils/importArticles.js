require("dotenv").config();
const mongoose = require("mongoose");

const Article = require("../models/Article");
const articles = require("../data/articles.json");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongo connected");

    await Article.deleteMany({});

    for (const article of articles) {
      await Article.create({
        title: article.title,
        intro: article.intro,

        section1Title: article.section1Title,
        section1Content: article.section1Content,

        section2Title: article.section2Title,
        section2Content: article.section2Content,

        section3Title: article.section3Title,
        section3Content: article.section3Content,

        section4Title: article.section4Title,
        section4Content: article.section4Content,
      });
    }

    console.log("Articles imported!");
    process.exit();
  })
  .catch(console.log);