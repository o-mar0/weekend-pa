
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
    this.checkMissionBuilder();

    newMissionButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.requestUserLocation();
    })
  }

  async checkAddForm() {
    const addFormEl = document.querySelector('.js-add-form');
    const addBtnEl = document.querySelector('.js-btn-add');
    if (addFormEl) {
      return addBtnEl.classList.add('d-none');
    }

    addBtnEl.classList.remove('d-none');
  }

  async checkMissionBuilder() {
    const mapEl = document.querySelector('.js-map');
    const missionBtnEl = document.querySelector('.js-btn-mission');
    if (mapEl) {
      return missionBtnEl.classList.add('d-none');
    }

    missionBtnEl.classList.remove('d-none');
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

