/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
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

const showGeneralErrorMessages = () => {
  const formRequiredInputs = Array.from(
    document.querySelectorAll(".required-input")
  );
  formRequiredInputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (
        input.validity.valueMissing ||
        (input.getAttribute("type") === "radio" && input.checked === false)
      ) {
        const inputType = input.getAttribute("name");
        input.setCustomValidity(`Hey, you forgot to add the ${inputType}!`);
        input.reportValidity();
      } else {
        input.setCustomValidity("");
      }
    });
    input.addEventListener("input", () => {
      input.setCustomValidity("");
    });
  });
};

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
  for (const button in radioButtonsArray) {
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
  for (const button in radioButtonsArray) {
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
  for (const button in radioButtonsArray) {
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
showGeneralErrorMessages();

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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsVUFBVTtBQUN4RTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxXQUFXO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGVBQWU7QUFDakM7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGVBQWU7QUFDbkQsTUFBTTtBQUNOO0FBQ0EsaUNBQWlDLGVBQWU7QUFDaEQsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLDJDQUEyQyxlQUFlO0FBQzFELFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFFBQVE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGVBQWU7QUFDekQsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi1saWJyYXJ5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGxpYnJhcnkgPSBbXTtcblxuZnVuY3Rpb24gQm9vayh0aXRsZSwgYXV0aG9yLCBwYWdlcywgcmVhZCwgcmF0aW5nKSB7XG4gIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgdGhpcy5hdXRob3IgPSBhdXRob3I7XG4gIHRoaXMucGFnZXMgPSBwYWdlcztcbiAgdGhpcy5yZWFkID0gcmVhZDtcbiAgdGhpcy5yYXRpbmcgPSByYXRpbmc7XG59XG5cbkJvb2sucHJvdG90eXBlLmNoYW5nZVJlYWRTdGF0dXMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnJlYWQgPT09IFwiSGF2ZSBSZWFkXCIpIHtcbiAgICB0aGlzLnJlYWQgPSBcIkhhdmUgTm90IFJlYWRcIjtcbiAgfSBlbHNlIGlmICh0aGlzLnJlYWQgPT09IFwiSGF2ZSBOb3QgUmVhZFwiKSB7XG4gICAgdGhpcy5yZWFkID0gXCJDdXJyZW50bHkgUmVhZGluZ1wiO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucmVhZCA9IFwiSGF2ZSBSZWFkXCI7XG4gIH1cbn07XG5cbkJvb2sucHJvdG90eXBlLmNoYW5nZVJhdGluZyA9IGZ1bmN0aW9uIChuZXdSYXRpbmcpIHtcbiAgaWYgKG5ld1JhdGluZyA+IDApIHtcbiAgICB0aGlzLnJhdGluZyA9IE51bWJlcihuZXdSYXRpbmcpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucmF0aW5nID0gdW5kZWZpbmVkO1xuICB9XG59O1xuXG5jb25zdCBmb3JtSW5wdXRUaXRsZUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2lucHV0LXRpdGxlXCIpO1xuY29uc3QgZm9ybUlucHV0QXV0aG9yRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5wdXQtYXV0aG9yXCIpO1xuY29uc3QgZm9ybUlucHV0UGFnZXNFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbnB1dC1wYWdlc1wiKTtcbmNvbnN0IGZvcm1SYWRpb0J1dHRvbnNTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yYWRpby1idXR0b25zXCIpO1xuY29uc3QgcmFkaW9CdXR0b25zQXJyYXkgPSBBcnJheS5mcm9tKFxuICBmb3JtUmFkaW9CdXR0b25zU2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilcbik7XG5jb25zdCBmb3JtSW5wdXRSYXRpbmdzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5wdXQtcmF0aW5nXCIpO1xuXG5jb25zdCBzaG93R2VuZXJhbEVycm9yTWVzc2FnZXMgPSAoKSA9PiB7XG4gIGNvbnN0IGZvcm1SZXF1aXJlZElucHV0cyA9IEFycmF5LmZyb20oXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5yZXF1aXJlZC1pbnB1dFwiKVxuICApO1xuICBmb3JtUmVxdWlyZWRJbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGlucHV0LnZhbGlkaXR5LnZhbHVlTWlzc2luZyB8fFxuICAgICAgICAoaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJyYWRpb1wiICYmIGlucHV0LmNoZWNrZWQgPT09IGZhbHNlKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9IGlucHV0LmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgICAgIGlucHV0LnNldEN1c3RvbVZhbGlkaXR5KGBIZXksIHlvdSBmb3Jnb3QgdG8gYWRkIHRoZSAke2lucHV0VHlwZX0hYCk7XG4gICAgICAgIGlucHV0LnJlcG9ydFZhbGlkaXR5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgaW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkoXCJcIik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLy8gQ2hlY2tzIGlmIGFueSBpbnB1dCB2YWx1ZXMgYXJlIGVtcHR5IGFuZCBpZiB0aGUgcGFnZXMgdmFsdWUgY29udGFpbiBhIG51bWJlclxuY29uc3QgdmFsaWRhdGVCb29rSW5mb3JtYXRpb24gPSAoKSA9PiB7XG4gIGxldCB2YWxpZEluZm9ybWF0aW9uID0gdHJ1ZTtcbiAgbGV0IHZhbGlkUmFkaW9CdXR0b25zID0gZmFsc2U7XG4gIGNvbnN0IGlucHV0VGl0bGVBbmRBdXRob3IgPSBbZm9ybUlucHV0VGl0bGVFbGVtZW50LCBmb3JtSW5wdXRBdXRob3JFbGVtZW50XTtcbiAgaW5wdXRUaXRsZUFuZEF1dGhvci5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RXJyb3JNZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aW5wdXQubmFtZX0tZXJyb3JgKTtcbiAgICBpZiAoaW5wdXQudmFsdWUudHJpbSgpLmxlbmd0aCA8IDEpIHtcbiAgICAgIGlucHV0RXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICB2YWxpZEluZm9ybWF0aW9uID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0RXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBmb3JtUGFnZXNFcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BhZ2VzLWVycm9yXCIpO1xuICBpZiAoXG4gICAgZm9ybUlucHV0UGFnZXNFbGVtZW50LnZhbHVlLnRyaW0oKS5sZW5ndGggPCAxIHx8XG4gICAgaXNOYU4oZm9ybUlucHV0UGFnZXNFbGVtZW50LnZhbHVlLnRyaW0oKSlcbiAgKSB7XG4gICAgZm9ybVBhZ2VzRXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdmFsaWRJbmZvcm1hdGlvbiA9IGZhbHNlO1xuICAgIGlmIChmb3JtSW5wdXRQYWdlc0VsZW1lbnQudmFsdWUudHJpbSgpLmxlbmd0aCA8IDEpIHtcbiAgICAgIGZvcm1QYWdlc0Vycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwiTWlzc2luZyBQYWdlcyFcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybVBhZ2VzRXJyb3JNZXNzYWdlLnRleHRDb250ZW50ID0gXCJUaGF0J3MgTm90IGEgVmFsaWQgTnVtYmVyIVwiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3JtUGFnZXNFcnJvck1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG4gIGNvbnN0IHJhZGlvQnV0dG9uc0Vycm9yTWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVhZC1zdGF0dXMtZXJyb3JcIik7XG4gIGZvciAoY29uc3QgYnV0dG9uIGluIHJhZGlvQnV0dG9uc0FycmF5KSB7XG4gICAgY29uc3QgcmFkaW9CdXR0b24gPSByYWRpb0J1dHRvbnNBcnJheVtidXR0b25dO1xuICAgIGlmIChyYWRpb0J1dHRvbi5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICB2YWxpZFJhZGlvQnV0dG9ucyA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKCF2YWxpZFJhZGlvQnV0dG9ucykge1xuICAgIHJhZGlvQnV0dG9uc0Vycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIHZhbGlkSW5mb3JtYXRpb24gPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByYWRpb0J1dHRvbnNFcnJvck1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG4gIHJldHVybiB2YWxpZEluZm9ybWF0aW9uO1xufTtcblxuY29uc3QgYWRkTmV3Qm9va1RvTGlicmFyeSA9ICgpID0+IHtcbiAgY29uc3QgZm9ybVRpdGxlVmFsdWUgPSBmb3JtSW5wdXRUaXRsZUVsZW1lbnQudmFsdWU7XG4gIGNvbnN0IGZvcm1BdXRob3JWYWx1ZSA9IGZvcm1JbnB1dEF1dGhvckVsZW1lbnQudmFsdWU7XG4gIGNvbnN0IGZvcm1QYWdlc1ZhbHVlID0gZm9ybUlucHV0UGFnZXNFbGVtZW50LnZhbHVlO1xuICBsZXQgaW5wdXRSZWFkU3RhdHVzID0gXCJcIjtcbiAgbGV0IGZvcm1SYXRpbmdzVmFsdWUgPSBmb3JtSW5wdXRSYXRpbmdzRWxlbWVudC52YWx1ZTtcbiAgZm9yIChjb25zdCBidXR0b24gaW4gcmFkaW9CdXR0b25zQXJyYXkpIHtcbiAgICBjb25zdCByYWRpb0J1dHRvbiA9IHJhZGlvQnV0dG9uc0FycmF5W2J1dHRvbl07XG4gICAgaWYgKHJhZGlvQnV0dG9uLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIGlucHV0UmVhZFN0YXR1cyA9IHJhZGlvQnV0dG9uLnZhbHVlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChmb3JtUmF0aW5nc1ZhbHVlICE9PSBcIlwiKSB7XG4gICAgZm9ybVJhdGluZ3NWYWx1ZSA9IE51bWJlcihmb3JtUmF0aW5nc1ZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBmb3JtUmF0aW5nc1ZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IG5ld0Jvb2sgPSBuZXcgQm9vayhcbiAgICBmb3JtVGl0bGVWYWx1ZSxcbiAgICBmb3JtQXV0aG9yVmFsdWUsXG4gICAgTnVtYmVyKGZvcm1QYWdlc1ZhbHVlKSxcbiAgICBpbnB1dFJlYWRTdGF0dXMsXG4gICAgZm9ybVJhdGluZ3NWYWx1ZVxuICApO1xuICBsaWJyYXJ5LnB1c2gobmV3Qm9vayk7XG59O1xuXG5jb25zdCByZXNldE5ld0Jvb2tGb3JtVmFsdWVzID0gKCkgPT4ge1xuICBmb3JtSW5wdXRUaXRsZUVsZW1lbnQudmFsdWUgPSBcIlwiO1xuICBmb3JtSW5wdXRBdXRob3JFbGVtZW50LnZhbHVlID0gXCJcIjtcbiAgZm9ybUlucHV0UGFnZXNFbGVtZW50LnZhbHVlID0gXCJcIjtcbiAgZm9yIChjb25zdCBidXR0b24gaW4gcmFkaW9CdXR0b25zQXJyYXkpIHtcbiAgICBjb25zdCByYWRpb0J1dHRvbiA9IHJhZGlvQnV0dG9uc0FycmF5W2J1dHRvbl07XG4gICAgaWYgKHJhZGlvQnV0dG9uLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIHJhZGlvQnV0dG9uLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBmb3JtSW5wdXRSYXRpbmdzRWxlbWVudC52YWx1ZSA9IFwiXCI7XG59O1xuXG4vLyBDcmVhdGVzIHJlbW92ZSBidXR0b24gRE9NIGVsZW1lbnQgYW5kIGFkZHMgZnVuY3Rpb25hbGl0eSB0byByZW1vdmUgY29ycmVzcG9uZGluZyBib29rIERPTSBlbGVtZW50XG5jb25zdCBhZGRSZW1vdmVCb29rQnV0dG9uID0gKG5ld0Jvb2tFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHJlbW92ZUJvb2tCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICByZW1vdmVCb29rQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gIHJlbW92ZUJvb2tCdXR0b24uY2xhc3NMaXN0LmFkZChcInJlbW92ZS1ib29rXCIpO1xuICBjb25zdCByZW1vdmVCb29rQnV0dG9uSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICByZW1vdmVCb29rQnV0dG9uSW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiYXNzZXRzL2Nsb3NlX2Jvb2sucG5nXCIpO1xuICByZW1vdmVCb29rQnV0dG9uSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiQ2FuY2VsXCIpO1xuICByZW1vdmVCb29rQnV0dG9uLmFwcGVuZENoaWxkKHJlbW92ZUJvb2tCdXR0b25JbWFnZSk7XG4gIG5ld0Jvb2tFbGVtZW50LmFwcGVuZENoaWxkKHJlbW92ZUJvb2tCdXR0b24pO1xuICByZW1vdmVCb29rQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgYm9va0luZGV4TnVtYmVyID0gbmV3Qm9va0VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBsaWJyYXJ5LnNwbGljZShib29rSW5kZXhOdW1iZXIsIDEsIHVuZGVmaW5lZCk7XG4gICAgbmV3Qm9va0VsZW1lbnQucmVtb3ZlKCk7XG4gIH0pO1xufTtcblxuLy8gQWRkcyBwcm9wZXJ0aWVzIG9mIHRoZSBuZXdseSBhZGRlZCBCb29rIG9iamVjdCB0byB0aGUgbmV3IGJvb2sncyBET00gZWxlbWVudFxuY29uc3QgYWRkQm9va0luZm9ybWF0aW9uID0gKG5ld0Jvb2ssIG5ld0Jvb2tFbGVtZW50KSA9PiB7XG4gIGNvbnN0IE5VTU9GUFRBRyA9IDQ7XG4gIGNvbnN0IGJvb2tJbmZvcm1hdGlvblNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBib29rSW5mb3JtYXRpb25TZWN0aW9uLmNsYXNzTGlzdC5hZGQoXCJib29rLWluZm9ybWF0aW9uXCIpO1xuICBjb25zdCBib29rVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG4gIGJvb2tUaXRsZS5jbGFzc0xpc3QuYWRkKFwidGl0bGVcIik7XG4gIGJvb2tUaXRsZS50ZXh0Q29udGVudCA9IG5ld0Jvb2sudGl0bGU7XG4gIGJvb2tJbmZvcm1hdGlvblNlY3Rpb24uYXBwZW5kQ2hpbGQoYm9va1RpdGxlKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1PRlBUQUc7IGkrKykge1xuICAgIGNvbnN0IHBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBwYXJhZ3JhcGguY2xhc3NMaXN0LmFkZChcImF1dGhvclwiKTtcbiAgICAgIHBhcmFncmFwaC50ZXh0Q29udGVudCA9IGBCeSAke25ld0Jvb2suYXV0aG9yfWA7XG4gICAgfSBlbHNlIGlmIChpID09PSAxKSB7XG4gICAgICBwYXJhZ3JhcGguY2xhc3NMaXN0LmFkZChcInBhZ2VzXCIpO1xuICAgICAgcGFyYWdyYXBoLnRleHRDb250ZW50ID0gYCR7bmV3Qm9vay5wYWdlc30gUGFnZXNgO1xuICAgIH0gZWxzZSBpZiAoaSA9PT0gMikge1xuICAgICAgcGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoXCJyZWFkXCIpO1xuICAgICAgcGFyYWdyYXBoLnRleHRDb250ZW50ID0gbmV3Qm9vay5yZWFkO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhZ3JhcGguY2xhc3NMaXN0LmFkZChcInJhdGluZ1wiKTtcbiAgICAgIGlmIChuZXdCb29rLnJhdGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmFncmFwaC50ZXh0Q29udGVudCA9IGBSYXRpbmc6ICR7bmV3Qm9vay5yYXRpbmd9LzVgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYWdyYXBoLnRleHRDb250ZW50ID0gXCJObyBSYXRpbmdcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgYm9va0luZm9ybWF0aW9uU2VjdGlvbi5hcHBlbmRDaGlsZChwYXJhZ3JhcGgpO1xuICB9XG4gIG5ld0Jvb2tFbGVtZW50LmFwcGVuZENoaWxkKGJvb2tJbmZvcm1hdGlvblNlY3Rpb24pO1xufTtcblxuLy8gQ3JlYXRlcyBjaGFuZ2UgcmVhZCBzdGF0dXMgYnV0dG9uIERPTSBlbGVtZW50IGFuZCBhZGRzIGZ1bmN0aW9uYWxpdHkgdG8gY3ljbGUgdGhyb3VnaCByZWFkIHN0YXR1c2VzXG5jb25zdCBhZGRDaGFuZ2VSZWFkU3RhdHVzQnV0dG9uID0gKG5ld0Jvb2ssIG5ld0Jvb2tFbGVtZW50LCBuZXdCb29rQnV0dG9ucykgPT4ge1xuICBjb25zdCBjaGFuZ2VSZWFkU3RhdHVzQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgY2hhbmdlUmVhZFN0YXR1c0J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICBjaGFuZ2VSZWFkU3RhdHVzQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2UtcmVhZC1idXR0b25cIik7XG4gIGNoYW5nZVJlYWRTdGF0dXNCdXR0b24udGV4dENvbnRlbnQgPSBcIkNoYW5nZSBSZWFkIFN0YXR1c1wiO1xuICBuZXdCb29rQnV0dG9ucy5hcHBlbmRDaGlsZChjaGFuZ2VSZWFkU3RhdHVzQnV0dG9uKTtcbiAgbmV3Qm9va0VsZW1lbnQuYXBwZW5kQ2hpbGQobmV3Qm9va0J1dHRvbnMpO1xuICBjaGFuZ2VSZWFkU3RhdHVzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbmV3Qm9vay5jaGFuZ2VSZWFkU3RhdHVzKCk7XG4gICAgY29uc3QgYm9va1JlYWRTdGF0dXMgPSBuZXdCb29rRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlYWRcIik7XG4gICAgYm9va1JlYWRTdGF0dXMudGV4dENvbnRlbnQgPSBuZXdCb29rLnJlYWQ7XG4gIH0pO1xufTtcblxuLy8gQ3JlYXRlcyBjaGFuZ2UgcmF0aW5nIGJ1dHRvbiBhbmQgc2VsZWN0aW9uIERPTSBlbGVtZW50cyBhbmQgYWRkcyBmdW5jdGlvbmFsaXR5IHRvIGNob29zZSBuZXcgcmF0aW5nc1xuY29uc3QgYWRkQ2hhbmdlUmF0aW5nQnV0dG9uID0gKG5ld0Jvb2ssIG5ld0Jvb2tFbGVtZW50LCBuZXdCb29rQnV0dG9ucykgPT4ge1xuICBjb25zdCBjaGFuZ2VSYXRpbmdCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBjaGFuZ2VSYXRpbmdCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgY2hhbmdlUmF0aW5nQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2UtcmF0aW5nLWJ1dHRvblwiKTtcbiAgY2hhbmdlUmF0aW5nQnV0dG9uLnRleHRDb250ZW50ID0gXCJDaGFuZ2UgUmF0aW5nXCI7XG4gIG5ld0Jvb2tCdXR0b25zLmFwcGVuZENoaWxkKGNoYW5nZVJhdGluZ0J1dHRvbik7XG4gIGNvbnN0IG5ld1JhdGluZ3NTZWxlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xuICBuZXdSYXRpbmdzU2VsZWN0aW9uLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJuZXctcmF0aW5nXCIpO1xuICBuZXdSYXRpbmdzU2VsZWN0aW9uLmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2UtcmF0aW5nLW9wdGlvbnNcIik7XG4gIG5ld0Jvb2tCdXR0b25zLmFwcGVuZENoaWxkKG5ld1JhdGluZ3NTZWxlY3Rpb24pO1xuICBuZXdCb29rRWxlbWVudC5hcHBlbmRDaGlsZChuZXdCb29rQnV0dG9ucyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IDU7IGkrKykge1xuICAgIGNvbnN0IHJhdGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIHJhdGluZy5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBcIlwiKTtcbiAgICAgIHJhdGluZy50ZXh0Q29udGVudCA9IFwiTmV3IFJhdGluZ1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICByYXRpbmcuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XG4gICAgICByYXRpbmcudGV4dENvbnRlbnQgPSBpO1xuICAgIH1cbiAgICBuZXdSYXRpbmdzU2VsZWN0aW9uLmFwcGVuZENoaWxkKHJhdGluZyk7XG4gIH1cbiAgY2hhbmdlUmF0aW5nQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbmV3Qm9vay5jaGFuZ2VSYXRpbmcobmV3UmF0aW5nc1NlbGVjdGlvbi52YWx1ZSk7XG4gICAgY29uc3QgYm9va1JhdGluZyA9IG5ld0Jvb2tFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmF0aW5nXCIpO1xuICAgIGlmIChuZXdSYXRpbmdzU2VsZWN0aW9uLnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICBib29rUmF0aW5nLnRleHRDb250ZW50ID0gYFJhdGluZzogJHtuZXdCb29rLnJhdGluZ30vNWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJvb2tSYXRpbmcudGV4dENvbnRlbnQgPSBcIk5vIFJhdGluZ1wiO1xuICAgIH1cbiAgICBuZXdSYXRpbmdzU2VsZWN0aW9uLnZhbHVlID0gXCJcIjtcbiAgfSk7XG59O1xuXG5jb25zdCBkaXNwbGF5TmV3bHlBZGRlZEJvb2sgPSAoKSA9PiB7XG4gIGNvbnN0IGJvb2tDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvb2stY29udGFpbmVyXCIpO1xuICBjb25zdCBuZXdCb29rID0gbGlicmFyeVtsaWJyYXJ5Lmxlbmd0aCAtIDFdO1xuICBjb25zdCBuZXdCb29rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IG5ld0Jvb2tCdXR0b25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgbmV3Qm9va0J1dHRvbnMuY2xhc3NMaXN0LmFkZChcImJvb2stYnV0dG9uc1wiKTtcbiAgbmV3Qm9va0VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlciA9IGxpYnJhcnkubGVuZ3RoIC0gMTtcbiAgbmV3Qm9va0VsZW1lbnQuY2xhc3NMaXN0LmFkZChcImJvb2tcIik7XG4gIGJvb2tDb250YWluZXIuYXBwZW5kQ2hpbGQobmV3Qm9va0VsZW1lbnQpO1xuICBhZGRSZW1vdmVCb29rQnV0dG9uKG5ld0Jvb2tFbGVtZW50KTtcbiAgYWRkQm9va0luZm9ybWF0aW9uKG5ld0Jvb2ssIG5ld0Jvb2tFbGVtZW50KTtcbiAgYWRkQ2hhbmdlUmVhZFN0YXR1c0J1dHRvbihuZXdCb29rLCBuZXdCb29rRWxlbWVudCwgbmV3Qm9va0J1dHRvbnMpO1xuICBhZGRDaGFuZ2VSYXRpbmdCdXR0b24obmV3Qm9vaywgbmV3Qm9va0VsZW1lbnQsIG5ld0Jvb2tCdXR0b25zKTtcbn07XG5cbmNvbnN0IGhpZGVGb3JtRXJyb3JNZXNzYWdlcyA9ICgpID0+IHtcbiAgY29uc3QgZm9ybUVycm9yTWVzc2FnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVycm9yLW1lc3NhZ2VcIik7XG4gIGZvcm1FcnJvck1lc3NhZ2VzLmZvckVhY2goKG1lc3NhZ2UpID0+IHtcbiAgICBtZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfSk7XG59O1xuXG5jb25zdCBhZGRGb3JtRGltID0gKCkgPT4ge1xuICBjb25zdCBib2R5RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuICBjb25zdCBmb3JtRGltRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IG5ld0Jvb2tGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImZvcm1cIik7XG4gIGZvcm1EaW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmb3JtLWRpbVwiKTtcbiAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoZm9ybURpbUVsZW1lbnQpO1xuICBmb3JtRGltRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHJlbW92ZUZvcm1EaW0oKTtcbiAgICBoaWRlRm9ybUVycm9yTWVzc2FnZXMoKTtcbiAgICBuZXdCb29rRm9ybS5jbGFzc0xpc3QucmVtb3ZlKFwiZm9ybS1zaG93aW5nXCIpO1xuICAgIG5ld0Jvb2tGb3JtLmNsYXNzTGlzdC5hZGQoXCJmb3JtLWhpZGluZ1wiKTtcbiAgfSk7XG59O1xuXG5jb25zdCByZW1vdmVGb3JtRGltID0gKCkgPT4ge1xuICBjb25zdCBmb3JtRGltRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS1kaW1cIik7XG4gIGZvcm1EaW1FbGVtZW50LnJlbW92ZSgpO1xufTtcblxuY29uc3QgYWRkRm9ybUJ1dHRvbkNsaWNrZXIgPSAoKSA9PiB7XG4gIGNvbnN0IG5ld0Jvb2tCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25ldy1ib29rLWJ1dHRvblwiKTtcbiAgY29uc3QgbmV3Qm9va0Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKTtcbiAgbmV3Qm9va0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGFkZEZvcm1EaW0oKTtcbiAgICBuZXdCb29rRm9ybS5jbGFzc0xpc3QucmVtb3ZlKFwiZm9ybS1oaWRpbmdcIik7XG4gICAgbmV3Qm9va0Zvcm0uY2xhc3NMaXN0LmFkZChcImZvcm0tc2hvd2luZ1wiKTtcbiAgfSk7XG59O1xuXG5jb25zdCBhZGRTdWJtaXRGb3JtQ2xpY2tlciA9ICgpID0+IHtcbiAgY29uc3Qgc3VibWl0Rm9ybUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWRkLWJvb2tcIik7XG4gIHN1Ym1pdEZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpZiAodmFsaWRhdGVCb29rSW5mb3JtYXRpb24oKSA9PT0gdHJ1ZSkge1xuICAgICAgYWRkTmV3Qm9va1RvTGlicmFyeSgpO1xuICAgICAgcmVzZXROZXdCb29rRm9ybVZhbHVlcygpO1xuICAgICAgZGlzcGxheU5ld2x5QWRkZWRCb29rKCk7XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IGFkZENhbmNlbEZvcm1DbGlja2VyID0gKCkgPT4ge1xuICBjb25zdCBjYW5jZWxGb3JtQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYW5jZWwtYnV0dG9uXCIpO1xuICBjb25zdCBuZXdCb29rRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpO1xuICBjYW5jZWxGb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgcmVtb3ZlRm9ybURpbSgpO1xuICAgIGhpZGVGb3JtRXJyb3JNZXNzYWdlcygpO1xuICAgIG5ld0Jvb2tGb3JtLmNsYXNzTGlzdC5yZW1vdmUoXCJmb3JtLXNob3dpbmdcIik7XG4gICAgbmV3Qm9va0Zvcm0uY2xhc3NMaXN0LmFkZChcImZvcm0taGlkaW5nXCIpO1xuICB9KTtcbn07XG5cbmFkZEZvcm1CdXR0b25DbGlja2VyKCk7XG5hZGRTdWJtaXRGb3JtQ2xpY2tlcigpO1xuYWRkQ2FuY2VsRm9ybUNsaWNrZXIoKTtcbnNob3dHZW5lcmFsRXJyb3JNZXNzYWdlcygpO1xuXG4vLyBBZGQgZXhhbXBsZSBib29rXG5jb25zdCBleGFtcGxlQm9vayA9IG5ldyBCb29rKFxuICBcIk1vYnkgRGljayAoRXhhbXBsZSlcIixcbiAgXCJIZXJtYW4gTWVsdmlsbGVcIixcbiAgMzc4LFxuICBcIkhhdmUgTm90IFJlYWRcIixcbiAgNFxuKTtcbmxpYnJhcnkucHVzaChleGFtcGxlQm9vayk7XG5kaXNwbGF5TmV3bHlBZGRlZEJvb2soKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==