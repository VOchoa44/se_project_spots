import { settings } from "../scripts/validation";
import "./index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import FormValidator from "../scripts/validation";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3e99b5df-fa4c-40c8-a208-e9ee0e7a4c5f",
    "Content-Type": "application/json",
  },
});

const cardsList = document.querySelector(".cards__list");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
let selectedCard, selectedCardId;
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const newCardElement = getCardElement(item);
      cardsList.append(newCardElement);
    });
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  .catch(console.error);

const editAvatarButton = document.querySelector(".profile__avatar-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const modalCloseButtonNewPost = newPostModal.querySelector(
  ".modal__close-button",
);
//delete modal
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCancel = deleteModal.querySelector(".modal__cancel-button");
const deleteModalclose = deleteModal.querySelector(
  ".modal__close-button_delete",
);

//avatar modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalButton = document.querySelector(".modal__close-button_avatar");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//edit profile modal
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const modalCloseButtonEditProfile = editProfileModal.querySelector(
  ".modal__close-button",
);
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

//new post modal
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");
const newPostButton = document.querySelector(".profile__new-post-button");

//preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button_preview",
);
const previewModalImage = previewModal.querySelector(".modal__preview-image");
const previewModalTitle = previewModal.querySelector(".modal__title-preview");
const modalOverlays = document.querySelectorAll(".modal");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

deleteModalCancel.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteModalclose.addEventListener("click", function () {
  closeModal(deleteModal);
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

avatarModalButton.addEventListener("click", function () {
  closeModal(avatarModal);
});

modalOverlays.forEach((modalElement) => {
  modalElement.addEventListener("click", function (evt) {
    if (evt.target.classList.contains("modal_is-opened")) {
      closeModal(modalElement);
    }
  });
});

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      closeModal(editProfileModal);
      editProfileValidator.resetValidation();
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      closeModal(deleteModal);
      selectedCard.remove();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLikeButton(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_active");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
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
  cardLikedButton.addEventListener("click", (evt) => {
    handleLikeButton(evt, data._id);
  });
  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id),
  );

  if (data.isLiked) {
    cardLikedButton.classList.toggle("card__like-button_active");
  }
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
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .createNewCard({
      link: newPostImageInput.value,
      name: newPostCaptionInput.value,
    })
    .then((data) => {
      const newElement = getCardElement(data);
      cardsList.prepend(newElement);
      closeModal(newPostModal);
      newPostValidator.resetValidation();
      newPostForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      closeModal(avatarModal);
      avatarValidator.resetValidation();
      profileAvatar.src = data.avatar;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

editAvatarButton.addEventListener("click", () => {
  openModal(avatarModal);
});

const editProfileValidator = new FormValidator(editProfileForm, settings);
const newPostValidator = new FormValidator(newPostForm, settings);
const avatarValidator = new FormValidator(avatarForm, settings);

editProfileValidator.enableValidation();
newPostValidator.enableValidation();
avatarValidator.enableValidation();
