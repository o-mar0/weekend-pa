export const initActiveAlert = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new ActiveAlert(el));
};

const fallbackUserLocation = {
  latitude: -37.82394,
  longitude: 144.99125
};

class ActiveAlert {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;

    this.init();
  }

  init() {
    if (this.el) {
      this.el.classList.add('alert--active');
      setTimeout(() => {
        this.el.classList.add('alert--hide')
      }
      ,2500);
    }
  }
}
