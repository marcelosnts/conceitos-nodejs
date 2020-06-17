const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
/*
 function handleTechs(techs){
   return techs.split(',').map(tech => tech.trim())
}
*/
function handleRepository(id, title, url, techs, likes){
  const newId = id === 0 ? uuid() : id;
  const countLikes = likes === 0 ? 0 : likes;
  const repository = {
    id : newId,
    title, 
    url, 
    techs,
    likes : countLikes
  };

  return repository;
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  //const serializedTechs = handleTechs(techs);
  //const repository = handleRepository(0, title, url, serializedTechs, 0);
  const repository = handleRepository(0, title, url, techs, 0);
  
  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({error : "Repository not found!"});
  }

  //const serializedTechs = handleTechs(techs);
  const likes = repositories[repositoryIndex].likes;
  
  //repositories[repositoryIndex] = handleRepository(id, title, url, serializedTechs, likes);
  repositories[repositoryIndex] = handleRepository(id, title, url, techs, likes);
  
  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    response.status(400).json({error : 'Repository not found!'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    response.status(400).json({error : 'Repository not found!'});
  }

  const repositoryLikes = repositories[repositoryIndex].likes;

  repositories[repositoryIndex].likes = repositoryLikes + 1;

  return response.json(repositories[repositoryIndex])
});

module.exports = app;
