const express = require('express');
const fs = require('fs');
const PORT = 8000
const app = express()
const EventEmitter = require('events'); 


let books = JSON.parse(fs.readFileSync('./data/books.json'));
app.use(express.json());
const logger = new EventEmitter();
// Using Middleware


app.get('/', (req, res) => {
    res.send('Hello World!')
});

// GET - api/v1/books
logger.on('getAllBooks', (message) => {
    console.log(`Event Logged: ${message}`);
  });
  
const getAllBooks = (req, res) => {
    logger.emit('getAllBooks', 'Gotten all books')
    res.status(200).json({
        status: 'success',
        count: books.length,
        data: {
            books: books
        }
    })
    logger.emit('getAllBooks', 'Gotten all books')
}

// GET - api/v1/books/:id
logger.on('getBooks', (message) => {
    console.log(`Event Logged: ${message}`);
  });
const getBooks = (req, res) => {
    logger.emit('getBooks', 'Book ' +id+ ' on the console')
    const id = Number(req.params.id);
    let book = books.find(el => el.id === id);

    if (!book) {
        return res.status(404).json({
            status: 'fail',
            message: 'Book with ID ' + id + ' is not found'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            book: book
        }
    })
}

// POST - api/v1/books
logger.on('createBooks', (message) => {
    console.log(`Event Logged: ${message}`);
});

const createBooks = (req, res) => {
    logger.emit('createBooks', 'Created book successfully')

    if (!req.body.title || !req.body.author || !req.body.publishedYear) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing required fields: title, author, publishedYear'
        });
    }

    const newId = books[books.length - 1].id + 1;
    const newBook = Object.assign({ id: newId }, req.body);
    books.push(newBook);

        fs.writeFile('./data/books.json', JSON.stringify(books), (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'fail',
                    message: 'Failed to save book to database'
                });
            }
            res.status(201).json({
                status: 'success',
                data: {
                    book: newBook
                }
            });
        });
    }

// PATCH - /api/v1/books/:id'
logger.on('updateBooks', (message) =>{
    console.log(`Event Logged: ${message}`)
})
const updateBooks = (req, res) => {
    logger.emit('updateBooks','updated book from '+id+' successfully')
    let id = Number(req.params.id * 1);

    let bookToUpdate = books.find(el => el.id === id);
    if (!bookToUpdate) {
        return res.status(404).json({
            status: 'fail',
            message: 'Book with ID ' + id + ' is not found'
        })
    }
    let index = books.indexOf(bookToUpdate);

    Object.assign(bookToUpdate, req.body);

    books[index] = bookToUpdate;
    
    fs.writeFile('./data/books.json', JSON.stringify(books), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Failed to update book in database'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                book: bookToUpdate
            }
        });
    })
}

// DELETE - /api/v1/books/:id
logger.on('deleteBooks', (message) =>{
    console.log(`Event Logged: ${message}`)
})
const deleteBooks = (req, res) => {
    const id = Number(req.params.id);

    // Find the index of the book directly
    const index = books.findIndex(book => book.id === id);

    // If book is not found, return a 404 error
    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: `Book with ID ${id} is not found`
        });
    }

    // Remove the book from the array
    const bookToDelete = books[index];
    books.splice(index, 1);

    // Write the updated books array to the file
    fs.writeFile('./data/books.json', JSON.stringify(books), (err) => {
        if (err) {
            console.error('Failed to delete book:', err.message); // Log the error for debugging
            return res.status(500).json({
                status: 'fail',
                message: 'Failed to delete book from database'
            });
        }

        // Respond with a 204 status for successful deletion
        res.status(204).send(); // No content
    });
    logger.emit('deleteBooks', 'Book ' +id+ ' deleted successfully')
};




app.post('/api/v1/books/', createBooks)
app.get('/api/v1/books', getAllBooks)
app.get('/api/v1/books/:id', getBooks)
app.patch('/api/v1/books/:id', updateBooks)
app.delete('/api/v1/books/:id', deleteBooks)

app.listen(PORT, () => {
        console.log('Server has started running on port 8000');
    })




    // const logger = function(req,res,next){
    //     console.log('Custom Middleware called');
    //     next();
    // }
    // requestedAt: req.requestedAt,    

// app.use(logger);
// app.use((req,res,next) => {
//     req.requestedAt = new Date().toISOString();
//     next();
// });