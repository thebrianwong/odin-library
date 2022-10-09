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

const submitFormButton = document.querySelector("#add-book");
submitFormButton.addEventListener("click", () => {
    addBook();
    resetFormValues();
})