import places from 'places.js';

const initAutocomplete = () => {
  const addressInput = document.querySelector('#task_location');
  if (addressInput) {
    places({ container: addressInput });
  }
};

export { initAutocomplete };
