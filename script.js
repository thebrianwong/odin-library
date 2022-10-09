let library = [];

function Book(title, author, pages, read, rating) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
}

const addBook = () => {
    const inputTitle = document.querySelector("#input-title").value;
    const inputAuthor = document.querySelector("#input-author").value;
    const inputPages = document.querySelector("#input-pages").value;
    const radioButtons = document.querySelector(".radio-buttons");
    const radioButtonsList = Array.from(radioButtons.querySelectorAll("input"));
    let inputReadStatus = "";
    for (button in radioButtonsList) {
        if (radioButtonsList[button].checked === true) {
            inputReadStatus = radioButtonsList[button].value;
            break;
        }
    }
    const inputRating = document.querySelector("#input-rating").value;
    const newBook = new Book(inputTitle, inputAuthor, inputPages, inputReadStatus, inputRating);
    library.push(newBook);
}

const resetFormValues = () => {
    const inputTitle = document.querySelector("#input-title");
    inputTitle.value = "";
    const inputAuthor = document.querySelector("#input-author");
    inputAuthor.value = "";
    const inputPages = document.querySelector("#input-pages");
    inputPages.value = "";
    const radioButtons = document.querySelector(".radio-buttons");
    const radioButtonsList = Array.from(radioButtons.querySelectorAll("input"));
    for (button in radioButtonsList) {
        if (radioButtonsList[button].checked === true) {
            radioButtonsList[button].checked = false;
            break;
        }
    }
    const inputRating = document.querySelector("#input-rating");
    inputRating.value = "";
}

// Leaving for now, displays old books repeatedly
const displayAllLibraryBooks = () => {
    const NUMOFPTAG = 4
    const container = document.querySelector(".container");
    for (book in library) {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book");
        const title = document.createElement("h2");
        title.classList.add("title");
        title.textContent = library[book]["title"];
        bookCard.appendChild(title);
        for (let i = 0; i < NUMOFPTAG; i++) {
            const paragraph = document.createElement("p");
            if (i === 0) {
                paragraph.classList.add("author");
                paragraph.textContent = library[book]["author"];
            } else if (i === 1) {
                paragraph.classList.add("pages");
                paragraph.textContent = library[book]["pages"];
            } else if (i === 2) {
                paragraph.classList.add("read");
                paragraph.textContent = library[book]["read"];
            } else {
                paragraph.classList.add("rating");
                if (library[book]["rating"] !== "") {
                    paragraph.textContent = `Rating: ${library[book]["rating"]}/5`;
                } else {
                    paragraph.textContent = `Rating: None`;
                }
            }
            bookCard.appendChild(paragraph);
        }
        container.appendChild(bookCard);
    }
}

const displayNewBook = () => {
    const NUMOFPTAG = 4
    const container = document.querySelector(".container");
    const newBook = library[library.length - 1];
    const bookCard = document.createElement("div");
    bookCard.classList.add("book");
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = newBook["title"];
    bookCard.appendChild(title);
    for (let i = 0; i < NUMOFPTAG; i++) {
        const paragraph = document.createElement("p");
        if (i === 0) {
            paragraph.classList.add("author");
            paragraph.textContent = newBook["author"];
        } else if (i === 1) {
            paragraph.classList.add("pages");
            paragraph.textContent = newBook["pages"];
        } else if (i === 2) {
            paragraph.classList.add("read");
            paragraph.textContent = newBook["read"];
        } else {
            paragraph.classList.add("rating");
            if (newBook["rating"] !== "") {
                paragraph.textContent = `Rating: ${newBook["rating"]}/5`;
            } else {
                paragraph.textContent = `Rating: None`;
            }
        }
        bookCard.appendChild(paragraph);
    }
    container.appendChild(bookCard);
}

const submitFormButton = document.querySelector("#add-book");
submitFormButton.addEventListener("click", () => {
    addBook();
    resetFormValues();
    displayNewBook();
})