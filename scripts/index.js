const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const modalCloseButtonEditProfile = editProfileModal.querySelector(
  ".modal__close-button",
);
const newPostButton = document.querySelector(".profile__new-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const modalCloseButtonNewPost = newPostModal.querySelector(
  ".modal__close-button",
);
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button_preview",
);
const previewModalImage = previewModal.querySelector(".modal__preview-image");
const previewModalTitle = previewModal.querySelector(".modal__title-preview");
const modalOverlays = document.querySelectorAll(".modal");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

modalCloseButtonEditProfile.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

modalCloseButtonNewPost.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", function (evt) {
  closeModal(previewModal);
});

modalOverlays.forEach((modalElement) => {
  modalElement.addEventListener("click", function (evt) {
    if (evt.target.classList.contains("modal_is-opened")) {
      closeModal(modalElement);
    }
  });
});

document.addEventListener("keydown", function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    closeModal(openModal);
  }
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  closeModal(editProfileModal);
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
}

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikedButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  cardLikedButton.addEventListener("click", function () {
    cardLikedButton.classList.toggle("card__like-button_active");
  });
  cardDeleteButton.addEventListener("click", function () {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalTitle.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: newPostCaptionInput.value,
    link: newPostImageInput.value,
  };
  const newElement = getCardElement(newCard);
  const submitButton = newPostForm.querySelector(".modal__submit-button");
  const inputList = Array.from(newPostForm.querySelectorAll(".modal__input"));
  cardsList.prepend(newElement);
  closeModal(newPostModal);
  newPostForm.reset();
  toggleButtonState(inputList, submitButton, settings);
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

initialCards.forEach((cardData) => {
  const newCardElement = getCardElement(cardData);
  cardsList.prepend(newCardElement);
});
