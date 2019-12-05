
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
    const newMissionButtonWrapper = this.el.querySelector('.js-btn-mission-wrapper');

    window.addEventListener('scroll', (event) => {
      console.log(event);
    });

    const clickButton = (event) => {
      event.preventDefault();
      newMissionButtonWrapper.classList.add('btn-mission--active');
      this.requestUserLocation();
    }

    newMissionButton.addEventListener('click', clickButton);
    newMissionButton.addEventListener('touchstart', clickButton);
  }

  checkIfMapPresent() {
    const mapEl = document.querySelector('.map');

    if (mapEl) {
      this.el.classList.add('d-none');
    }
  }

  requestUserLocation() {
    setTimeout(() => {
     if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          window.location = '/mission?lat=' + position.coords.latitude + '&long=' + position.coords.longitude;
        }, () => {
          // Error fallback.
          window.location = '/mission?lat=' + fallbackUserLocation.latitude + '&long=' + fallbackUserLocation.longitude;
        });
      } else {
        window.location = '/mission?lat=' + fallbackUserLocation.latitude + '&long=' + fallbackUserLocation.longitude;
      }
    }, 2000);
  }

}

