const library = [];

function Book(title, author, pages, read, rating) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.rating = rating;
}

Book.prototype.changeReadStatus = function () {
  if (this.read === "Have Read") {
    this.read = "Have Not Read";
  } else if (this.read === "Have Not Read") {
    this.read = "Currently Reading";
  } else {
    this.read = "Have Read";
  }
};

Book.prototype.changeRating = function (newRating) {
  if (newRating > 0) {
    this.rating = Number(newRating);
  } else {
    this.rating = undefined;
  }
};

const formInputTitleElement = document.querySelector("#input-title");
const formInputAuthorElement = document.querySelector("#input-author");
const formInputPagesElement = document.querySelector("#input-pages");
const formRadioButtonsSection = document.querySelector(".radio-buttons");
const radioButtonsArray = Array.from(
  formRadioButtonsSection.querySelectorAll("input")
);
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
      validInformation = false;
    } else {
      inputErrorMessage.style.display = "none";
    }
  });
  const formPagesErrorMessage = document.querySelector("#pages-error");
  if (
    formInputPagesElement.value.trim().length < 1 ||
    isNaN(formInputPagesElement.value.trim())
  ) {
    formPagesErrorMessage.style.display = "block";
    validInformation = false;
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
      validRadioButtons = true;
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
};

const addNewBookToLibrary = () => {
  const formTitleValue = formInputTitleElement.value;
  const formAuthorValue = formInputAuthorElement.value;
  const formPagesValue = formInputPagesElement.value;
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
    formRatingsValue = undefined;
  }
  const newBook = new Book(
    formTitleValue,
    formAuthorValue,
    Number(formPagesValue),
    inputReadStatus,
    formRatingsValue
  );
  library.push(newBook);
};

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
};

// Creates remove button DOM element and adds functionality to remove corresponding book DOM element
const addRemoveBookButton = (newBookElement) => {
  const removeBookButton = document.createElement("button");
  removeBookButton.setAttribute("type", "button");
  removeBookButton.classList.add("remove-book");
  const removeBookButtonImage = document.createElement("img");
  removeBookButtonImage.setAttribute("src", "assets/close_book.png");
  removeBookButtonImage.setAttribute("alt", "Cancel");
  removeBookButton.appendChild(removeBookButtonImage);
  newBookElement.appendChild(removeBookButton);
  removeBookButton.addEventListener("click", () => {
    bookIndexNumber = newBookElement.dataset.indexNumber;
    library.splice(bookIndexNumber, 1, undefined);
    newBookElement.remove();
  });
};

// Adds properties of the newly added Book object to the new book's DOM element
const addBookInformation = (newBook, newBookElement) => {
  const NUMOFPTAG = 4;
  const bookInformationSection = document.createElement("div");
  bookInformationSection.classList.add("book-information");
  const bookTitle = document.createElement("h2");
  bookTitle.classList.add("title");
  bookTitle.textContent = newBook.title;
  bookInformationSection.appendChild(bookTitle);
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
    bookInformationSection.appendChild(paragraph);
  }
  newBookElement.appendChild(bookInformationSection);
};

// Creates change read status button DOM element and adds functionality to cycle through read statuses
const addChangeReadStatusButton = (newBook, newBookElement, newBookButtons) => {
  const changeReadStatusButton = document.createElement("button");
  changeReadStatusButton.setAttribute("type", "button");
  changeReadStatusButton.classList.add("change-read-button");
  changeReadStatusButton.textContent = "Change Read Status";
  newBookButtons.appendChild(changeReadStatusButton);
  newBookElement.appendChild(newBookButtons);
  changeReadStatusButton.addEventListener("click", () => {
    newBook.changeReadStatus();
    const bookReadStatus = newBookElement.querySelector(".read");
    bookReadStatus.textContent = newBook.read;
  });
};

// Creates change rating button and selection DOM elements and adds functionality to choose new ratings
const addChangeRatingButton = (newBook, newBookElement, newBookButtons) => {
  const changeRatingButton = document.createElement("button");
  changeRatingButton.setAttribute("type", "button");
  changeRatingButton.classList.add("change-rating-button");
  changeRatingButton.textContent = "Change Rating";
  newBookButtons.appendChild(changeRatingButton);
  const newRatingsSelection = document.createElement("select");
  newRatingsSelection.setAttribute("name", "new-rating");
  newRatingsSelection.classList.add("change-rating-options");
  newBookButtons.appendChild(newRatingsSelection);
  newBookElement.appendChild(newBookButtons);
  for (let i = 0; i <= 5; i++) {
    const rating = document.createElement("option");
    if (i === 0) {
      rating.setAttribute("value", "");
      rating.textContent = "New Rating";
    } else {
      rating.setAttribute("value", i);
      rating.textContent = i;
    }
    newRatingsSelection.appendChild(rating);
  }
  changeRatingButton.addEventListener("click", () => {
    newBook.changeRating(newRatingsSelection.value);
    const bookRating = newBookElement.querySelector(".rating");
    if (newRatingsSelection.value !== "") {
      bookRating.textContent = `Rating: ${newBook.rating}/5`;
    } else {
      bookRating.textContent = "No Rating";
    }
    newRatingsSelection.value = "";
  });
};

const displayNewlyAddedBook = () => {
  const bookContainer = document.querySelector(".book-container");
  const newBook = library[library.length - 1];
  const newBookElement = document.createElement("div");
  const newBookButtons = document.createElement("div");
  newBookButtons.classList.add("book-buttons");
  newBookElement.dataset.indexNumber = library.length - 1;
  newBookElement.classList.add("book");
  bookContainer.appendChild(newBookElement);
  addRemoveBookButton(newBookElement);
  addBookInformation(newBook, newBookElement);
  addChangeReadStatusButton(newBook, newBookElement, newBookButtons);
  addChangeRatingButton(newBook, newBookElement, newBookButtons);
};

const hideFormErrorMessages = () => {
  const formErrorMessages = document.querySelectorAll(".error-message");
  formErrorMessages.forEach((message) => {
    message.style.display = "none";
  });
};

const addFormDim = () => {
  const bodyElement = document.querySelector("body");
  const formDimElement = document.createElement("div");
  const newBookForm = document.querySelector("form");
  formDimElement.classList.add("form-dim");
  bodyElement.appendChild(formDimElement);
  formDimElement.addEventListener("click", () => {
    removeFormDim();
    hideFormErrorMessages();
    newBookForm.classList.remove("form-showing");
    newBookForm.classList.add("form-hiding");
  });
};

const removeFormDim = () => {
  const formDimElement = document.querySelector(".form-dim");
  formDimElement.remove();
};

const addFormButtonClicker = () => {
  const newBookButton = document.querySelector("#new-book-button");
  const newBookForm = document.querySelector("form");
  newBookButton.addEventListener("click", () => {
    addFormDim();
    newBookForm.classList.remove("form-hiding");
    newBookForm.classList.add("form-showing");
  });
};

const addSubmitFormClicker = () => {
  const submitFormButton = document.querySelector("#add-book");
  submitFormButton.addEventListener("click", () => {
    if (validateBookInformation() === true) {
      addNewBookToLibrary();
      resetNewBookFormValues();
      displayNewlyAddedBook();
    }
  });
};

const addCancelFormClicker = () => {
  const cancelFormButton = document.querySelector("#cancel-button");
  const newBookForm = document.querySelector("form");
  cancelFormButton.addEventListener("click", () => {
    removeFormDim();
    hideFormErrorMessages();
    newBookForm.classList.remove("form-showing");
    newBookForm.classList.add("form-hiding");
  });
};

addFormButtonClicker();
addSubmitFormClicker();
addCancelFormClicker();

// Add example book
const exampleBook = new Book(
  "Moby Dick (Example)",
  "Herman Melville",
  378,
  "Have Not Read",
  4
);
library.push(exampleBook);
displayNewlyAddedBook();
