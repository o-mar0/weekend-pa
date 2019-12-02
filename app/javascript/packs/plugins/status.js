export const initStatusUpdate = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new StatusUpdate(el));
};

class StatusUpdate {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.init();
  }

  async init() {
    this.el.addEventListener('change', event => {
      Rails.fire(event.target.parentElement.parentElement.parentElement, 'submit');
    });
  }

}

