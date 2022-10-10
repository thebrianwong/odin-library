let library = [];

function Book(title, author, pages, read, rating) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
}

Book.prototype.changeReadStatus = function() {
    if (this.read === "Yes") {
        this.read = "No";
    } else if (this.read === "No") {
        this.read = "Currently Reading";
    } else {
        this.read = "Yes";
    }
}

Book.prototype.changeRating = function(newRating) {
    if (newRating !== NaN) {
        this.rating = newRating;
    } else {
        this.rating = "";
    }
}

const addNewBookToLibrary = () => {
    const inputTitle = document.querySelector("#input-title").value;
    const inputAuthor = document.querySelector("#input-author").value;
    const inputPages = document.querySelector("#input-pages").value;
    const inputRadioButtons = document.querySelector(".radio-buttons");
    const radioButtonsList = Array.from(inputRadioButtons.querySelectorAll("input"));
    let inputReadStatus = "";
    for (button in radioButtonsList) {
        const radioButton = radioButtonsList[button];
        if (radioButton.checked === true) {
            inputReadStatus = radioButton.value;
            break;
        }
    }
    const inputRating = document.querySelector("#input-rating").value;
    const newBook = new Book(inputTitle, inputAuthor, inputPages, inputReadStatus, inputRating);
    library.push(newBook);
}

const resetNewBookFormValues = () => {
    const inputTitle = document.querySelector("#input-title");
    inputTitle.value = "";
    const inputAuthor = document.querySelector("#input-author");
    inputAuthor.value = "";
    const inputPages = document.querySelector("#input-pages");
    inputPages.value = "";
    const inputRadioButtons = document.querySelector(".radio-buttons");
    const radioButtonsList = Array.from(inputRadioButtons.querySelectorAll("input"));
    for (button in radioButtonsList) {
        const radioButton = radioButtonsList[button];
        if (radioButton.checked === true) {
            radioButton.checked = false;
            break;
        }
    }
    const inputRating = document.querySelector("#input-rating");
    inputRating.value = "";
}

// Creates remove button DOM element and adds functionality to remove corresponding book DOM element
const addRemoveBookButton = (bookCard) => {
    const removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.classList.add("remove-book");
    const removeButtonImage = document.createElement("img");
    removeButtonImage.setAttribute("src", "assets/close.png");
    removeButtonImage.setAttribute("alt", "Cancel");
    removeButton.appendChild(removeButtonImage);
    bookCard.appendChild(removeButton);
    removeButton.addEventListener("click", () => {
        indexNumber = bookCard.dataset.indexNumber;
        library.splice(indexNumber, 1, undefined)
        bookCard.remove();
    })
}

// Adds properties of the newly added Book object to the new book's DOM element
const addBookDetails= (bookCard, newBook) => {
    const NUMOFPTAG = 4;
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = newBook.title;
    bookCard.appendChild(title);
    for (let i = 0; i < NUMOFPTAG; i++) {
        const paragraph = document.createElement("p");
        if (i === 0) {
            paragraph.classList.add("author");
            paragraph.textContent = newBook.author;
        } else if (i === 1) {
            paragraph.classList.add("pages");
            paragraph.textContent = newBook.pages;
        } else if (i === 2) {
            paragraph.classList.add("read");
            paragraph.textContent = newBook.read;
        } else {
            paragraph.classList.add("rating");
            if (newBook.rating !== "") {
                paragraph.textContent = `Rating: ${newBook.rating}/5`;
            } else {
                paragraph.textContent = `Rating: None`;
            }
        }
        bookCard.appendChild(paragraph);
    }
}

// Creates change read status button DOM element and adds functionality to cycle through read statuses
const addChangeReadStatusButton = (bookCard, newBook) => {
    const readStatusButton = document.createElement("button");
    readStatusButton.setAttribute("type", "button");
    readStatusButton.classList.add("change-read-button");
    readStatusButton.textContent = "Change Read Status";
    bookCard.appendChild(readStatusButton);
    readStatusButton.addEventListener("click", () => {
        newBook.changeReadStatus();
        const bookReadStatus = bookCard.querySelector(".read");
        bookReadStatus.textContent = newBook.read;
    })
}

// Creates change rating button and selection DOM elements and adds functionality to choose new ratings
const addChangeRatingButton = (bookCard, newBook) => {
    const changeRatingButton = document.createElement("button");
    changeRatingButton.setAttribute("type", "button");
    changeRatingButton.classList.add("change-rating-button");
    changeRatingButton.textContent = "Change Rating";
    bookCard.appendChild(changeRatingButton);
    const ratingSelection = document.createElement("select");
    bookCard.appendChild(ratingSelection);
    ratingSelection.setAttribute("name", "new-rating");
    // ratingSelection.setAttribute("id", "new-rating") Not sure if necessary
    for (let i = 0; i <= 5; i++) {
        const option = document.createElement("option");
        if (i === 0) {
            option.setAttribute("value", "");
            option.textContent = "New Rating";
        } else {
            option.setAttribute("value", i);
            option.textContent = i
        }
        ratingSelection.appendChild(option);
    }
    changeRatingButton.addEventListener("click", () => {
        newBook.changeRating(ratingSelection.value);
        const bookRating = bookCard.querySelector(".rating");
        if (ratingSelection.value !== "") {
            bookRating.textContent = `Rating: ${newBook.rating}/5`;
        } else {
            bookRating.textContent = "No Rating";
        }
        ratingSelection.value = "";
    })
}

const displayNewlyAddedBook = () => {
    const container = document.querySelector(".container");
    const newBook = library[library.length - 1];
    const bookCard = document.createElement("div");
    bookCard.dataset.indexNumber = library.length - 1;
    bookCard.classList.add("book");
    container.appendChild(bookCard);
    addRemoveBookButton(bookCard);
    addBookDetails(bookCard, newBook);
    addChangeReadStatusButton(bookCard, newBook);
    addChangeRatingButton(bookCard, newBook);
}

const addFormButtonClicker = () => {
    const newBookButton = document.querySelector("#new-book-button");
    const newBookForm = document.querySelector("form");
    newBookButton.addEventListener("click", () => {
        newBookForm.classList.remove("form-hiding");
        newBookForm.classList.add("form-showing");
    })
}

const addSubmitFormClicker = () => {
    const submitFormButton = document.querySelector("#add-book");
    submitFormButton.addEventListener("click", () => {
        addNewBookToLibrary();
        resetNewBookFormValues();
        displayNewlyAddedBook();
    })
}

const addCancelFormClicker = () => {
    const cancelButton = document.querySelector("#cancel-button");
    const newBookForm = document.querySelector("form");
    cancelButton.addEventListener("click", () => {
        newBookForm.classList.remove("form-showing");
        newBookForm.classList.add("form-hiding");
    })
}

addFormButtonClicker();
addSubmitFormClicker();
addCancelFormClicker();
