function showSnackbar(element, message, color) {
  const snack = document.querySelector(element);

  //Reset classes
  snack.classList.remove("info");
  snack.classList.remove("warning");
  snack.classList.remove("success");

  //Set new snackbar
  snack.textContent = message;
  snack.classList.add("show");
  snack.classList.add(color);

  //animation and style
  setTimeout(() => {
    snack.classList.remove("show");
    snack.classList.remove(color);
  }, 2500);
}
export { showSnackbar };
