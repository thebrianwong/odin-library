let library = [];

function Book(title, author, pages, read, rating) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
}

function addBook() {
    // const title = prompt("What is the name of the book?");
    const inputTitle = document.querySelector("#input-title").value;
    const inputAuthor = document.querySelector("#input-author").value;
    const inputPages = document.querySelector("#input-pages").value;
    const radioButtonsReadStatus = prompt("Have you read this book?");
    const rating = prompt("What would you rate this book out of 5?");
    const newBook = new Book(inputTitle, author, pages, read, rating);
    library.push(newBook);
}