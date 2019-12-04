export const initUpdateCheckbox = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new UpdateCheckbox(el));
};

class UpdateCheckbox {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.emptyCheckbox = this.el.parentElement.querySelector('.checkbox-empty');
    this.tickCheckbox = this.el.parentElement.querySelector('.checkbox-tick');

    this.init();
  }

  async init() {
    this.el.addEventListener('change', event => {
      this.updateCheckboxState(event);
    });
  }


  updateCheckboxState(event) {
    this.emptyCheckbox.classList.toggle('d-none');
    this.tickCheckbox.classList.toggle('d-none');
  }
}

