/*
  Example safe-executing JS script for Lewagon.
  packs/plugins/myPlugin.js
*/
import { featureCollection, feature } from '@turf/turf';
import { Map } from './map';

export const initMission = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new Mission(el));
};

class Mission {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;

    this.categoryEls = this.el.querySelectorAll('.js-category-card');

    this.mapEl = this.el.querySelector('.js-map');
    this.map = new Map(this.mapEl);
    this.nextEl = this.el.querySelector('.js-next-btn');
    this.finalStepEl = this.el.querySelector('.js-final-step');

    this.currentMissionStep = 0;

    this.markers = [];

    this.init();
  }

  async init() {
    this.drawCategoriesOnMap();
    this.displayMissionStep();

    this.nextEl.addEventListener('click', () => {
      this.currentMissionStep ++;

      this.displayMissionStep();
      this.updateMap();
    });
  }

  async drawCategoriesOnMap() {
    const checkedCategoryNames = Array.from(this.categoryEls)
      .map(categoryEl => categoryEl.dataset.categoryName);

    await this.map.updateCategoryNames(checkedCategoryNames);
    this.updateMap();
  }

  updateMap() {
    this.map.zoomIntoJourney(this.currentMissionStep);
  }

  displayMissionStep() {
    this.categoryEls.forEach(categoryEl => categoryEl.classList.add('d-none'));

    if (this.currentMissionStep === this.categoryEls.length) {
      this.finalStepEl.classList.remove('d-none');
      this.nextEl.classList.add('d-none');
    }
    else {
      const currentCategoryEl = this.categoryEls[this.currentMissionStep];
      currentCategoryEl.classList.remove('d-none');
    }
  }

}

