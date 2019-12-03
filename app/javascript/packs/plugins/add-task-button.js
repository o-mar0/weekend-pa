export const initAddButton = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new AddButton(el));
};

class AddButton {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.errandFormEl = document.querySelector('.js-form-errand');
    this.appointmentFormEl = document.querySelector('.js-form-appointment');
    this.btnEls = document.querySelectorAll('.js-btn');

    this.init();
  }

  async init() {
    this.el.addEventListener('click', event => {
      // reset d-none for FormEls
      this.errandFormEl.classList.add('d-none');
      this.appointmentFormEl.classList.add('d-none');
      this.el.classList.remove('btn-active');
      if ('errand' in event.target.dataset) {
        this.errandFormEl.classList.remove('d-none');
        this.el.classList.add('btn-active');
      } if ('appointment' in event.target.dataset) {
        this.appointmentFormEl.classList.remove('d-none');
        this.el.classList.add('btn-active');
      }
      for (let i = 0; i < this.btnEls.length; i++) {
        if (!(this.el === this.btnEls[i])) {
          return this.btnEls[i].classList.remove('btn-active');
        }
      }
    });
  }
}
