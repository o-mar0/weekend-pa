export default class LoadingScreen {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.displayContainerEl = document.querySelector('.display-container');
  }

  endLoading() {
    this.el.classList.toggle('d-none');
    this.el.classList.toggle('d-flex');
  }
}
