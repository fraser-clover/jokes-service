const express = require("express");
const app = express();
const { Joke } = require("./db");
const { Op } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jokes", async (req, res, next) => {
  try {
    // TODO - filter the jokes by tags and content

    const { tags, content } = req.query;

    // const where = {};

    // if (tags) where.tags = tags;
    // if (content) where.joke = content;
    
    let jokes;

    if(tags || content){
       jokes = await Joke.findAll({
    
        where: {
          [Op.or]: [
            {
              tags: {
                [Op.like]: `%${tags}%`
              }
            },
            { 
              joke: {
                [Op.like]: `%${content}%`
              }
            },
          ],
        },
  
      });
    } else {

       jokes = await Joke.findAll({
      });

    }
   

    // const jokesByTag = await Joke.findAll({
    //   where: {
    //     tags: {
    //       [Op.like]: `%${tags}%`
    //     }
    //   }
    // });

    // const jokesByContent = await Joke.findAll({
    //   where: {
    //     joke: {
    //       [Op.like]: `%${content}%`
    //     }
    //   }
    // });

    //   where[key] =  {
    //     [Op.like]: `%${req.query[key]}%` // search within the string, not only exact matches
    // };

    res.send(jokes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
