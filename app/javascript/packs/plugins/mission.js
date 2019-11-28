/*
  Example safe-executing JS script for Lewagon.
  packs/plugins/myPlugin.js
*/
import { featureCollection, feature } from '@turf/turf';
import { Map } from './map';

export const initMissionBuilder = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new MissionBuilder(el));
};

class MissionBuilder {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;

    this.categoryEls = this.el.querySelectorAll('.js-category');

    this.mapEl = this.el.querySelector('.js-map');
    this.map = new Map(this.mapEl);

    this.markers = [];

    this.init();
  }

  async init() {
    this.syncCheckboxesWithMap();

    this.categoryEls.forEach(categoryEl => {
      categoryEl.addEventListener('change', (event) => {
        this.syncCheckboxesWithMap();
      });
    });
  }

  syncCheckboxesWithMap() {
    const checkedCategoryNames = Array.from(this.categoryEls)
      .filter(categoryEl => categoryEl.checked)
      .map(categoryEl => categoryEl.value);

    this.map.updateCategoryNames(checkedCategoryNames);
  }

}

