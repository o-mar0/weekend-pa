
export const initNavbar = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new MyPlugin(el));
};

const fallbackUserLocation = {
  latitude: -37.82394,
  longitude: 144.99125
};

class MyPlugin {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.init();
  }

  init() {
    this.checkIfMapPresent();
    const newMissionButton = this.el.querySelector('.js-new-mission-button');

    window.addEventListener('scroll', (event) => {
      console.log(event);
    });

    newMissionButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.requestUserLocation();
    });
    newMissionButton.addEventListener('touchstart', (event) => {
      event.preventDefault();
      this.requestUserLocation();
    })
  }

  checkIfMapPresent() {
    const mapEl = document.querySelector('.map');

    if (mapEl) {
      this.el.classList.add('d-none');
    }
  }

  requestUserLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        window.location = '/mission?lat=' + position.coords.latitude + '&long=' + position.coords.longitude
      }, () => {
        // Error fallback.
        window.location = '/mission?lat=' + fallbackUserLocation.latitude + '&long=' + fallbackUserLocation.longitude
      });
    } else {
      alert('You cannot get location')
    }

  }

}

