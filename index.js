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

app.get("/jokes/:id", async (req, res) => {

  let jokes = await Joke.findByPk(req.params.id)
  res.send(jokes);

})

app.post("/jokes", async (req, res) => {
    const { tags, joke } = req.body;
    const newJoke = await Joke.create({tags, joke});
    res.json(newJoke);
})

app.put("/jokes/:id", async (req, res) => {
    const {tags, joke} = req.body;
    const specificJoke = await Joke.findByPk(req.params.id);
    await specificJoke.update({
      tags, joke
     })
    res.send(specificJoke);
});


app.delete("/jokes/:id", async (req, res) => {
  const jokeToDelete = await Joke.findByPk(req.params.id);
  await jokeToDelete.destroy();
  const jokes = await Joke.findAll({})
  res.send(jokes);
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
