
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
    this.scrollPos = 0;

    this.listButton = this.el.querySelector('.js-btn-list')
    this.listButtonWrapper = this.el.querySelector('.js-btn-list-wrapper');

    this.addButton = this.el.querySelector('.js-btn-add')
    this.addButtonWrapper = this.el.querySelector('.js-btn-add-wrapper');

    this.newMissionButton = this.el.querySelector('.js-new-mission-button');
    this.newMissionButtonWrapper = this.el.querySelector('.js-btn-mission-wrapper');

    this.init();
  }

  init() {
    this.checkIfMapPresent();

    this.navbarScroll();

    this.clickListButton();
    this.clickAddButton();
    this.clickMissionButton();

  }

  checkIfMapPresent() {
    const mapEl = document.querySelector('.map');

    if (mapEl) {
      this.el.classList.add('d-none');
    }
  }

  navbarScroll() {
    this.el.classList.add('footer-active');
    window.addEventListener('scroll', (event) => {
      if (window.scrollY > this.scrollPos) {
        this.el.classList.remove('footer-active');
      }
      else {
        this.el.classList.add('footer-active');
        // saves the new position for iteration.
      };
      this.scrollPos = window.scrollY;
    });
  }

  clickListButton() {
    const listButtonEvent = () => {
      this.listButtonWrapper.classList.add('btn-list--active');
    }

    this.listButton.addEventListener('click', listButtonEvent);
    this.listButton.addEventListener('touchstart', listButtonEvent);
  }

  clickAddButton() {
    const addButtonEvent = () => {
      this.addButtonWrapper.classList.add('btn-add--active');
    }

    this.addButton.addEventListener('click', addButtonEvent);
    this.addButton.addEventListener('touchstart', addButtonEvent);
  }

  clickMissionButton() {
    const missionButtonEvent = (event) => {
      event.preventDefault();
      this.newMissionButtonWrapper.classList.add('btn-mission--active');
      this.requestUserLocation();
    }

    this.newMissionButton.addEventListener('click', missionButtonEvent);
    this.newMissionButton.addEventListener('touchstart', missionButtonEvent);
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

