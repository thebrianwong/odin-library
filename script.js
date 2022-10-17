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
    if (newRating > 0) {
        this.rating = Number(newRating);
    } else {
        this.rating = undefined;
    }
}

const formInputTitleElement = document.querySelector("#input-title");
const formInputAuthorElement = document.querySelector("#input-author");
const formInputPagesElement = document.querySelector("#input-pages");
const formRadioButtonsSection = document.querySelector(".radio-buttons");
const radioButtonsArray = Array.from(formRadioButtonsSection.querySelectorAll("input"));
const formInputRatingsElement = document.querySelector("#input-rating");

// Checks if any input values are empty and if the pages value contain a number
const validateBookInformation = () => {
    let validInformation = true;
    let validRadioButtons = false;
    const inputTitleAndAuthor = [formInputTitleElement, formInputAuthorElement];
    inputTitleAndAuthor.forEach((input) => {
        const inputErrorMessage = document.querySelector(`#${input.name}-error`);
        if (input.value.trim().length < 1) {
            inputErrorMessage.style.display = "block";
            validInformation = false
        } else {
            inputErrorMessage.style.display = "none";
        }
    })
    const formPagesErrorMessage = document.querySelector("#pages-error");
    if (formInputPagesElement.value.trim().length < 1 || isNaN(formInputPagesElement.value.trim())) {
        formPagesErrorMessage.style.display = "block";
        validInformation = false
        if (formInputPagesElement.value.trim().length < 1) {
            formPagesErrorMessage.textContent = "Missing Pages!";
        } else {
            formPagesErrorMessage.textContent = "That's Not a Valid Number!";
        }
    } else {
        formPagesErrorMessage.style.display = "none";
    }
    const radioButtonsErrorMessage = document.querySelector("#read-status-error");
    for (button in radioButtonsArray) {
        const radioButton = radioButtonsArray[button];
        if (radioButton.checked === true) {
            validRadioButtons = true
            break;
        }
    }
    if (!validRadioButtons) {
        radioButtonsErrorMessage.style.display = "block";
        validInformation = false;
    } else {
        radioButtonsErrorMessage.style.display = "none";
    }
    return validInformation;
}

const addNewBookToLibrary = () => {
    let formTitleValue = formInputTitleElement.value;
    let formAuthorValue = formInputAuthorElement.value;
    let formPagesValue = formInputPagesElement.value;
    let inputReadStatus = "";
    let formRatingsValue = formInputRatingsElement.value;
    for (button in radioButtonsArray) {
        const radioButton = radioButtonsArray[button];
        if (radioButton.checked === true) {
            inputReadStatus = radioButton.value;
            break;
        }
    }
    if (formRatingsValue !== "") {
        formRatingsValue = Number(formRatingsValue);
    } else {
        formRatingsValue = undefined
    }
    const newBook = new Book(formTitleValue, formAuthorValue, Number(formPagesValue), inputReadStatus, formRatingsValue);
    library.push(newBook);
}

const resetNewBookFormValues = () => {
    formInputTitleElement.value = "";
    formInputAuthorElement.value = "";
    formInputPagesElement.value = "";
    for (button in radioButtonsArray) {
        const radioButton = radioButtonsArray[button];
        if (radioButton.checked === true) {
            radioButton.checked = false;
            break;
        }
    }
    formInputRatingsElement.value = "";
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
const addBookInformation = (newBook, bookCard) => {
    const NUMOFPTAG = 4;
    const bookInformation = document.createElement("div");
    bookInformation.classList.add("book-information");
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = newBook.title;
    bookInformation.appendChild(title);
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
            if (newBook.rating !== undefined) {
                paragraph.textContent = `Rating: ${newBook.rating}/5`;
            } else {
                paragraph.textContent = "No Rating";
            }
        }
        bookInformation.appendChild(paragraph);
    }
    bookCard.appendChild(bookInformation);
}

// Creates change read status button DOM element and adds functionality to cycle through read statuses
const addChangeReadStatusButton = (newBook, bookCard, bookButtons) => {
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
const addChangeRatingButton = (newBook, bookCard, bookButtons) => {
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
    addBookInformation(newBook, bookCard);
    addChangeReadStatusButton(newBook, bookCard, bookButtons);
    addChangeRatingButton(newBook, bookCard, bookButtons);
}

const hideFormErrorMessages = () => {
    const formErrorMessages = document.querySelectorAll(".error-message");
    formErrorMessages.forEach((message) => {
        message.style.display = "none";
    })
}

const addFormDim = () => {
    const bodyElement = document.querySelector("body");
    const dimFilter = document.createElement("div");
    const newBookForm = document.querySelector("form");
    dimFilter.classList.add("form-dim");
    bodyElement.appendChild(dimFilter);
    dimFilter.addEventListener("click", () => {
        removeFormDim();
        hideFormErrorMessages();
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
        if (validateBookInformation() === true) {
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
        hideFormErrorMessages();
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