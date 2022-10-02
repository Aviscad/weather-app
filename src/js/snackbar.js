function showSnackbar(element, message, color) {
  const snack = document.querySelector(element);
  snack.textContent = message;
  snack.classList.add("show");
  snack.classList.add(color);
  setTimeout(() => {
    snack.classList.remove("show");
    snack.classList.remove(color);
  }, 2500);
}
export { showSnackbar };
