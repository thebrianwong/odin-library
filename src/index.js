import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  getDocs,
  documentId,
} from "firebase/firestore";
import { getFirebaseConfig } from "./firebase-config.js";

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
  saveBookToDatabase(newBook);
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
const addRemoveBookButton = (book, newBookElement) => {
  const removeBookButton = document.createElement("button");
  removeBookButton.setAttribute("type", "button");
  removeBookButton.classList.add("remove-book");
  const removeBookButtonImage = document.createElement("img");
  removeBookButtonImage.setAttribute("src", "assets/close_book.png");
  removeBookButtonImage.setAttribute("alt", "Cancel");
  removeBookButton.appendChild(removeBookButtonImage);
  newBookElement.appendChild(removeBookButton);
  removeBookButton.addEventListener("click", () => {
    // bookIndexNumber = newBookElement.dataset.indexNumber;
    // library.splice(bookIndexNumber, 1, undefined);
    // newBookElement.remove();

    removeBookFromDatabase(newBookElement.dataset.bookId);
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
      if (newBook.rating !== "") {
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
    // const bookReadStatus = newBookElement.querySelector(".read");
    // bookReadStatus.textContent = newBook.read;

    updateBookInDatabase(newBookElement.dataset.bookId, "read", newBook.read);
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
    // const bookRating = newBookElement.querySelector(".rating");
    // if (newRatingsSelection.value !== "") {
    //   bookRating.textContent = `Rating: ${newBook.rating}/5`;
    // } else {
    //   bookRating.textContent = "No Rating";
    // }
    newRatingsSelection.value = "";
    updateBookInDatabase(
      newBookElement.dataset.bookId,
      "rating",
      newBook.rating
    );
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

// Firebase-related functions

const saveBookToDatabase = async (book) => {
  if (book.rating === undefined) {
    book.rating = "Have Not Read";
  }
  try {
    await addDoc(collection(getFirestore(), "library"), {
      title: book.title,
      author: book.author,
      pages: book.pages,
      read: book.read,
      rating: book.rating,
    });
  } catch (e) {
    console.error("Could not save book to database: ", e);
  }
};

const removeBookFromDatabase = async (id) => {
  const documentQuery = query(libraryRef, where(documentId(), "==", `${id}`));
  const querySnapshot = await getDocs(documentQuery);
  querySnapshot.forEach((document) => {
    deleteDoc(document.ref);
  });
};

const updateBookInDatabase = async (dbDocumentId, valueType, newValue) => {
  if (newValue === undefined) {
    newValue = "";
  }
  const documentRef = doc(db, "library", `${dbDocumentId}`);
  await updateDoc(documentRef, {
    [valueType]: newValue,
  });
};

const removeDeletedBook = (id) => {
  const bookElement = document.querySelector(`[data-book-id="${id}"]`);
  bookElement.parentElement.removeChild(bookElement);
};

const modifyUpdatedBook = (book, id) => {
  const bookElement = document.querySelector(`[data-book-id="${id}"]`);
  const readStatusElement = bookElement.querySelector(".read");
  const ratingElement = bookElement.querySelector(".rating");
  readStatusElement.textContent = book.read;
  if (book.rating !== "") {
    ratingElement.textContent = `Rating: ${book.rating}/5`;
  } else {
    ratingElement.textContent = "No Rating";
  }
};

const loadBooks = () => {
  const libraryBooks = query(collection(getFirestore(), "library"));

  onSnapshot(libraryBooks, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const bookData = change.doc.data();
      const dbDocumentId = change.doc.id;
      const bookObject = new Book(
        bookData.title,
        bookData.author,
        bookData.pages,
        bookData.read,
        bookData.rating
      );
      if (change.type === "added") {
        displayBookFromDatabase(bookObject, dbDocumentId);
      } else if (change.type === "removed") {
        removeDeletedBook(dbDocumentId);
      } else if (change.type === "modified") {
        modifyUpdatedBook(bookObject, dbDocumentId);
      }
    });
  });
};

// New functions for old functions that don't work well with Firebase integration

const displayBookFromDatabase = (book, id) => {
  const bookContainer = document.querySelector(".book-container");
  const bookElement = document.createElement("div");
  const bookButtons = document.createElement("div");
  bookButtons.classList.add("book-buttons");
  bookElement.dataset.bookId = id;
  bookElement.classList.add("book");
  bookContainer.appendChild(bookElement);
  addRemoveBookButton(book, bookElement);
  addBookInformation(book, bookElement);
  addChangeReadStatusButton(book, bookElement, bookButtons);
  addChangeRatingButton(book, bookElement, bookButtons);
};

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);
const db = getFirestore(app);
const libraryRef = collection(db, "library");

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
// displayNewlyAddedBook();
loadBooks();
