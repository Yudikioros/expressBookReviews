const express = require('express');
const axios = require('axios');
const baseURL = "http://localhost:5000";
let books = require("./booksdb.js");
const {1: book} = require("./booksdb");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookCount = Object.entries(books).length;

    let authorBooks = {};
    for (let i = 1; i <= bookCount; i++) {
        if (books[i].author === author) {
            authorBooks[i] = books[i];
        }
    }
    if (Object.keys(authorBooks).length > 0) {
        res.send(authorBooks);
    } else {
        res.status(404).json({author: author, message: "Author not found"});
    }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookCount = Object.entries(books).length;

    let titleBooks = {};
    for (let i = 1; i <= bookCount; i++) {
        if (books[i].title === title) {
            titleBooks[i] = books[i];
        }
    }
    if (Object.keys(titleBooks).length > 0) {
        res.send(titleBooks);
    } else {
        res.status(404).json({title: title, message: "Title not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    } else {
        res.status(404).json({message: "Book not found"});
    }

});



// AXIOS requests for testing

// Get all books
const getBooks = async () => {
    try {
        const response = await axios.get(`${baseURL}/`);
        console.log("Getting all books");
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }

}

// Get books by ISBN
const getBooksByISBN = async (isbn) => {
    try {
        const response = await axios.get(`${baseURL}/isbn/${isbn}`);
        console.log("Getting a book by ISBN");
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}

// Get books by author
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`${baseURL}/author/${author}`);
        console.log("Getting a book by author");
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}

// Get books by title
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`${baseURL}/title/${title}`);
        console.log("Getting a book by title");
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}

module.exports.general = public_users;
