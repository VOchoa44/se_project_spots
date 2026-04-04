const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const modalCloseButtonEditProfile = editProfileModal.querySelector(
  ".modal__close-button",
);
const newPostButton = document.querySelector(".profile__new-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const modalCloseButtonNewPost = newPostModal.querySelector(
  ".modal__close-button",
);

editProfileButton.addEventListener("click", function () {
  editProfileModal.setAttribute("style", "visibility:visible");
});

modalCloseButtonEditProfile.addEventListener("click", function () {
  editProfileModal.removeAttribute("style");
});

newPostButton.addEventListener("click", function () {
  newPostModal.setAttribute("style", "visibility:visible");
});

modalCloseButtonNewPost.addEventListener("click", function () {
  newPostModal.removeAttribute("style");
});
