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

const displayNewBook = () => {
    const NUMOFPTAG = 4
    const container = document.querySelector(".container");
    const newBook = library[library.length - 1];
    const bookCard = document.createElement("div");
    bookCard.dataset.indexNumber = library.length - 1;
    bookCard.classList.add("book");
    
    // Functionality to delete book from library
    addRemoveBookButton(bookCard);

    // Adds contents of the book entry
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

    // Adds read status change button
    const readStatusButton = document.createElement("button");
    readStatusButton.setAttribute("type", "button");
    readStatusButton.classList.add("change-read-button");
    readStatusButton.textContent = "Change Read Status";
    bookCard.appendChild(readStatusButton);
    readStatusButton.addEventListener("click", () => {
        newBook.changeReadStatus();
        const bookReadStatus = bookCard.querySelector(".read");
        bookReadStatus.textContent = newBook["read"];
    })


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
            bookRating.textContent = `Rating: ${ratingSelection.value}/5`;
        } else {
            bookRating.textContent = "No Rating";
        }
        ratingSelection.value = "";
    })

    

    /* 
    add change read status and change rating buttons
    use same function with diff arguments
    */
    const addChangeButton = (bookCard, property) => {
        const newButton = document.createElement("button");
        newButton.setAttribute("type", "button");
        newButton.classList.add(`change-${property}-button`);
        if (property === "read") {
            newButton.textContent = "Change Read Status";
        } else if (property === "rating") {
            newButton.textContent = "Change Rating";
        }
        bookCard.appendChild(newButton);
        newButton.addEventListener("click", () => {
            newBook.changeReadStatus();
            if (property === "read") {
                newBook.changeReadStatus();
            } else if (property === "rating") {
                newButton.changeRating()
            }
            const displayedProperty = bookCard.querySelector(`.${property}`);
            displayedProperty.textContent = newBook[`${property}`];
        })
    }

    container.appendChild(bookCard);
}

const addFormButtonClicker = () => {
    const newBookButton = document.querySelector("#new-book-button");
    const newBookForm = document.querySelector("form");
    newBookButton.addEventListener("click", () => {
        newBookForm.classList.remove("form-hiding");
        newBookForm.classList.add("form-showing");
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

const addSubmitFormClicker = () => {
    const submitFormButton = document.querySelector("#add-book");
    submitFormButton.addEventListener("click", () => {
        addBook();
        resetFormValues();
        displayNewBook();
    })
}

addSubmitFormClicker();
addFormButtonClicker();
addCancelFormClicker();



// Not sure how useful this is, but will keep it around for now
// const displayFormButton = document.querySelector("#new-book-button");
// displayFormButton.addEventListener("click", () => {
//     const formDiv = document.querySelector(".form")
//     formDiv.innerHTML = `
//         <form action="">
//         <label for="input-title">Title</label>
//         <input type="text" id="input-title" name="title">
//         <label for="input-author">Author</label>
//         <input type="text" id="input-author" name="author">
//         <label for="input-pages">Pages</label>
//         <input type="tel" id="input-pages" name="pages">
//         <div class="radio-buttons">
//             <legend>Have you read this book?</legend>
//             <input type="radio" id="input-yes" name="read-status" value="Yes">
//             <label for="input-yes">Yes</label>
//             <input type="radio" id="input-no" name="read-status" value="No">
//             <label for="input-no">No</label>
//             <input type="radio" id="input-currently-reading" name="read-status" value="Currently Reading">
//             <label for="input-currently-reading">Currently Reading</label>
//         </div>
//         <div>
//             <label for="input-rating">What would you rate this book? (Optional)</label>
//             <select name="rating" id="input-rating">
//                 <option value="">Rating</option>
//                 <option value="1">1</option>
//                 <option value="2">2</option>
//                 <option value="3">3</option>
//                 <option value="4">4</option>
//                 <option value="5">5</option>
//             </select>
//         </div>
//         <input type="button" value="Submit" id="add-book">
//         </form>
//     `
// })

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