// Import express package
const { count } = require('console');
const express = require('express');
const fs = require('fs');
const { get } = require('http');
// REST ARCHITECTURE  [31-10-2024]

let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

//middleware 

//GET METHOD - api/movies [for making get request]
    //v1 stands for the version. Advantage is if you modify the v1[an already existing api] it may break down so you will create a modified one v2.
    const logger = function(req,res,next){
        console.log('Custom Middleware called');
        next();
    }
    
    app.use(express.json());
    app.use(logger);
    

const getAllMovie = (req,res)=>{
        res.status(200).json({
         status: "success",
         count: movies.length,
         data: {
            movies: movies
         }
        })
}
// GET - api/v1/movies/id  

const getMovie =(req,res)=>{
    //   console.log(req.params);
    
        const id = req.params.id * 1; //convert the id from string to number dynamically 
    
        let movie = movies.find(el => el.id === id) //'find' will loop over the array and find the particular id. 
    
    
        if(!movie){
           return res.status(404).json({
                status: "fail",
                message: 'Movie with ID' +id+ 'is not found'
            })
             
        }
        res.status(200).json({
            status: "success",
            data: {
            movie: movie
        }
     })
}

const createMovie =(req,res)=>{
    // in order to attach the request to the body, we use a middelware 
    const newId = movies[movies.length - 1].id + 1;

    const newMovie = Object.assign({id: newId}, req.body)

    movies.push(newMovie);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
       res.status(201).json({
            status: "success",
            data: {
                movie: newMovie
            }
       })
    })

//    console.log(req.body);
//    res.send('Created');
}
  
//   res.send('Test movie');


// })
const updateMovie =(req,res)=>{ //update movie using ID. It must come with a collon 

    let id = req.params.id * 1; //convert the id from string to number dynamically 

    let movieToUpdate = movies.find(el => el.id === id); // loop over the movie array using 'find'
    if(!movieToUpdate) {
        return res.status(404).json({
            status: "fail",
            message: 'No movie object with ID' +id+ 'is found'
        })
    }

    let index = movies.indexOf(movieToUpdate); //pass an object 'movieToUpdate' to turn to an index. eg id=4, index=3

    Object.assign(movieToUpdate, req.body); //'Object.assign' is used to merge 2 object. if the 2 have diff properties, a new object will be created. it will have the propertiest from both first and second object. if they have common the first will be updated and the value will be set to that value of the second object 

    movies[index] = movieToUpdate;

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: "success",
            data: {
                movie: movieToUpdate
            }
        })
    })
}

const deleteMovie =(req,res)=>{
    const id = req.params.id * 1; //convert the id from string to number dynamically 

    const movieToDelete = movies.find(el => el.id === id); // loop over the movie array using 'find'

    if(!movieToDelete) {
        return res.status(404).json({
            status: "fail",
            message: 'No movie object with ID' +id+ ' is found'
        })
    }

    const index = movies.indexOf(movieToDelete);

    movies.splice(index, 1);

    
    fs.writeFile('./data/movies.json',JSON.stringify(movies), (err) => {
        res.status(204).json({
            status: "success",
            data: {
                movie: movieToDelete
            }
        })
    })
}

// app.post('/api/v1/movies', createMovie)
// // PATCH API [14/11/2024]
// app.patch('/api/v1/movies/:id', updateMovie)
// // DELETE API
// app.delete('/api/v1/movies/:id', deleteMovie)

// app.get('/api/v1/movies', getAllMovie)

// app.get('/api/v1/movies/:id', getMovie)

app.route('/api/v1/movies')
.get(getAllMovie)
.get(getMovie)

app.route('/api/v1/movies/:id')
.patch(updateMovie)
.delete(deleteMovie)
.post(createMovie)

//create a server
const port = 3000;
app.listen(port, () => {
    console.log('Server has started');
})