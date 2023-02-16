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

    res.send(jokes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/jokes", async (req, res) => {
    const { tags, joke } = req.body;
    const newJoke = await Joke.create({tags, joke});
    res.json(newJoke);
})

app.put("/jokes/:id", (req, res) => {
    const {tags, joke} = req.body;
    jokes[req.params.id].tags = tags;
    jokes[req.params.id].joke = joke;
    res.send(jokes);
});


app.delete("/jokes/:id", (req, res) => {
    jokes = jokes.filter((joke, idx) => idx !== Number(req.params.id));
    res.send(jokes);
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
