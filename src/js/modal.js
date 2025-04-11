const pokemonModal = document.getElementById("modal");

export const closeModal = () => {
  pokemonModal.classList.remove("hidden");
};

export const showModal = (title, message) => {
  pokemonModal.querySelector("#modalTitle").textContent = title;
  pokemonModal.querySelector("#modalDescription").textContent = message;
  closeModal();
};
