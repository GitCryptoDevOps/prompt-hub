// popup.js

document.addEventListener('DOMContentLoaded', function () {
  // Exemple : Charger le contenu du popup
  const popupContent = document.getElementById('popup-content');

  if (popupContent) {
    popupContent.textContent = 'Bienvenue sur le popup de l\'extension !';
  }

  // Exemple : Ajouter un gestionnaire d'événements
  const button = document.getElementById('popup-button');
  if (button) {
    button.addEventListener('click', function () {
      alert('Le bouton a été cliqué !');
    });
  }
});
