
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

    newMissionButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.requestUserLocation();
    })
  }

  requestUserLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        window.location = '/new_mission?lat=' + position.coords.latitude + '&long=' + position.coords.longitude
      });
    } else {
      alert('You cannot get location')
    }

  }

}

