export const initStatusUpdate = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new StatusUpdate(el));
};

class StatusUpdate {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.emptyCheckbox = this.el.parentElement.querySelector('.checkbox-empty');
    this.tickCheckbox = this.el.parentElement.querySelector('.checkbox-tick');

    this.init();
  }

  async init() {
    this.el.addEventListener('change', event => {
      this.submitStatusUpdate(event);
    });
  }


  submitStatusUpdate(event) {
    if (event.target.checked) {
      event.target.status = 1;
    }
    else {
      event.target.status = 0;
    }
    Rails.fire(event.target.parentElement.parentElement.parentElement, 'submit');
  }
}

