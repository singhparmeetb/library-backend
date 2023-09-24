require('dotenv').config();
const express = require('express');
// const router = Router();
const bodyParser = require('body-parser'); // Import body-parser
const cors = require('cors');
const mongoose = require('mongoose');
const bookSchema = require("./Schema/book");
const userSchema = require("./Schema/user");
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Listening on port", process.env.PORT);
    })
}).catch((error) => {
    console.log(error.message);
})


// Get all books
app.get('/', async (req, res) => {
    try {
        const books = await bookSchema.find({});
        // res.send("Hello World");
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Create a new book
app.post('/', async (req, res) => {
    try {
        const newBook = new bookSchema(req.body);
        const savedBook = await newBook.save();

        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ error: 'Could not create book' });
    }
});



// Get a specific book by ID
app.get('/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await bookSchema.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a book by ID
app.put('/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        const updatedBook = await bookSchema.findByIdAndUpdate(bookId, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a book by ID
app.delete('/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        const deletedBook = await bookSchema.findByIdAndRemove(bookId);
        if (!deletedBook) {
            res.status(200).json(deletedBook);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database for a user with the provided email and password
        const user = await userSchema.findOne({ email, password });

        if (user) {
            // User found, login successful
            res.status(200).json({ message: 'Login successful' });
        } else {
            // User not found, login failed
            res.status(401).json({ message: 'Login failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/signup', async (req, res) => {
    try {
        // Destructure user data from the request body
        const { email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Create a new user
        const newUser = new userSchema({
            email,
            password,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup failed:', error);
        res.status(500).json({ error: 'Signup failed. Please try again later' });
    }
});