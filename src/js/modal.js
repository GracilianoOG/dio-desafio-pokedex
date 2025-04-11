const pokemonModal = document.getElementById("modal");

export const showModal = (title, message) => {
  pokemonModal.querySelector("#modalTitle").textContent = title;
  pokemonModal.querySelector("#modalDescription").textContent = message;
  pokemonModal.classList.remove("hidden");
};
