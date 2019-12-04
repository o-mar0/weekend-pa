export const initLoadingScreen = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new LoadingScreen(el));
};

class LoadingScreen {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.route = this.el.querySelectorAll('#route');
    this.init();
  }

  init() {
    if (!this.el) {
      return;
    }

    this.route.addEventListener('load', (event) => {
      console.log('This page has loaded!');
    });
  }
}
