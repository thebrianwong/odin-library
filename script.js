let library = [];

function Book(title, author, pages, read, rating) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
}

Book.prototype.changeReadStatus = function() {
    if (this.read === "Have Read") {
        this.read = "Have Not Read";
    } else if (this.read === "Have Not Read") {
        this.read = "Currently Reading";
    } else {
        this.read = "Have Read";
    }
}

Book.prototype.changeRating = function(newRating) {
    if (newRating !== NaN) {
        this.rating = newRating;
    } else {
        this.rating = "";
    }
}

const validateBookDetails = () => {
    let validDetails = true;
    const inputTitle = document.querySelector("#input-title");
    const inputAuthor = document.querySelector("#input-author");
    const inputPages = document.querySelector("#input-pages");
    const inputNonRadio = [inputTitle, inputAuthor, inputPages];
    for (input in inputNonRadio) {
        const inputErrorMessage = document.querySelector(`#${inputNonRadio[input].name}-error`);
        if (inputNonRadio[input].value.trim().length < 1) {
            inputErrorMessage.style.display = "block";
            validDetails = false
        } else {
            inputErrorMessage.style.display = "none";
        }
    }
    const inputRadioButtons = document.querySelector(".radio-buttons");
    const radioButtonsList = Array.from(inputRadioButtons.querySelectorAll("input"));
    const radioButtonsErrorMessage = document.querySelector("#read-status-error");
    let validRadioButtons = false;
    for (button in radioButtonsList) {
        const radioButton = radioButtonsList[button];
        console.log(radioButton)
        if (radioButton.checked === true) {
            console.log("checked")
            validRadioButtons = true
            break;
        }
    }
    if (!validRadioButtons) {
        radioButtonsErrorMessage.style.display = "block";
        validDetails = false;
    } else {
        radioButtonsErrorMessage.style.display = "none";
    }
    return validDetails;
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
    removeButtonImage.setAttribute("src", "assets/close_book.png");
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
    const bookDetails = document.createElement("div");
    bookDetails.classList.add("book-information");
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = newBook.title;
    bookDetails.appendChild(title);
    for (let i = 0; i < NUMOFPTAG; i++) {
        const paragraph = document.createElement("p");
        if (i === 0) {
            paragraph.classList.add("author");
            paragraph.textContent = `By ${newBook.author}`;
        } else if (i === 1) {
            paragraph.classList.add("pages");
            paragraph.textContent = `${newBook.pages} Pages`;
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
        bookDetails.appendChild(paragraph);
    }
    bookCard.appendChild(bookDetails);
}

// Creates change read status button DOM element and adds functionality to cycle through read statuses
const addChangeReadStatusButton = (bookCard, newBook, bookButtons) => {
    const readStatusButton = document.createElement("button");
    readStatusButton.setAttribute("type", "button");
    readStatusButton.classList.add("change-read-button");
    readStatusButton.textContent = "Change Read Status";
    bookButtons.appendChild(readStatusButton);
    bookCard.appendChild(bookButtons);
    readStatusButton.addEventListener("click", () => {
        newBook.changeReadStatus();
        const bookReadStatus = bookCard.querySelector(".read");
        bookReadStatus.textContent = newBook.read;
    })
}

// Creates change rating button and selection DOM elements and adds functionality to choose new ratings
const addChangeRatingButton = (bookCard, newBook, bookButtons) => {
    const changeRatingButton = document.createElement("button");
    changeRatingButton.setAttribute("type", "button");
    changeRatingButton.classList.add("change-rating-button");
    changeRatingButton.textContent = "Change Rating";
    bookButtons.appendChild(changeRatingButton);
    const ratingSelection = document.createElement("select");
    ratingSelection.setAttribute("name", "new-rating");
    ratingSelection.classList.add("change-rating-options");
    bookButtons.appendChild(ratingSelection);
    bookCard.appendChild(bookButtons);
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
    const bookContainer = document.querySelector(".book-container");
    const newBook = library[library.length - 1];
    const bookCard = document.createElement("div");
    const bookButtons = document.createElement("div");
    bookButtons.classList.add("book-buttons");
    bookCard.dataset.indexNumber = library.length - 1;
    bookCard.classList.add("book");
    bookContainer.appendChild(bookCard);
    addRemoveBookButton(bookCard);
    addBookDetails(bookCard, newBook);
    addChangeReadStatusButton(bookCard, newBook, bookButtons);
    addChangeRatingButton(bookCard, newBook, bookButtons);
}

const addFormDim = () => {
    const bodyElement = document.querySelector("body");
    const dimFilter = document.createElement("div");
    const newBookForm = document.querySelector("form");
    dimFilter.classList.add("form-dim");
    bodyElement.appendChild(dimFilter);
    dimFilter.addEventListener("click", () => {
        removeFormDim();
        newBookForm.classList.remove("form-showing");
        newBookForm.classList.add("form-hiding");
    })
}

const removeFormDim = () => {
    const dimFilter = document.querySelector(".form-dim");
    dimFilter.remove();
}

const addFormButtonClicker = () => {
    const newBookButton = document.querySelector("#new-book-button");
    const newBookForm = document.querySelector("form");
    newBookButton.addEventListener("click", () => {
        addFormDim();
        newBookForm.classList.remove("form-hiding");
        newBookForm.classList.add("form-showing");
    })
}

const addSubmitFormClicker = () => {
    const submitFormButton = document.querySelector("#add-book");
    submitFormButton.addEventListener("click", () => {
        if (validateBookDetails() === true) {
            addNewBookToLibrary();
            resetNewBookFormValues();
            displayNewlyAddedBook();
        }
    })
}

const addCancelFormClicker = () => {
    const cancelButton = document.querySelector("#cancel-button");
    const newBookForm = document.querySelector("form");
    cancelButton.addEventListener("click", () => {
        removeFormDim();
        newBookForm.classList.remove("form-showing");
        newBookForm.classList.add("form-hiding");
    })
}

addFormButtonClicker();
addSubmitFormClicker();
addCancelFormClicker();

// Add example book
const exampleBook = new Book("Moby Dick (Example)", "Herman Melville", 378, "Have Not Read", 4);
library.push(exampleBook);
displayNewlyAddedBook();