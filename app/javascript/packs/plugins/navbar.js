
export const initNavbar = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new MyPlugin(el));
};

class MyPlugin {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.init();
  }

  init() {
    const newMissionButton = this.el.querySelector('#js-new-mission-button');

    this.checkAddForm();

    newMissionButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.requestUserLocation();
    })
  }

  async checkAddForm() {
    const addForm = document.querySelector('.add-form')
    const map = document.querySelector('.js-map');
    const addBtn = document.querySelector('.btn-add');
    if (addForm || map) {
      return addBtn.classList.add('d-none');
    }

    addBtn.classList.remove('d-none');
  }

  requestUserLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        window.location = '/mission?lat=' + position.coords.latitude + '&long=' + position.coords.longitude
      });
    } else {
      alert('You cannot get location')
    }

  }

}

