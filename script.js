let library = [];

function Book(title, author, pages, read, rating) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
}

function addBook() {
    const title = prompt("What is the name of the book?");
    const author = prompt("Who is the author of this book?");
    const pages = prompt("How many pages does this book have?");
    const read = prompt("Have you read this book?");
    const rating = prompt("What would you rate this book out of 5?");
    const newBook = new Book(title, author, pages, read, rating);
    library.push(newBook);
}