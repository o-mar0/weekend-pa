/*
  Example safe-executing JS script for Lewagon.
  packs/plugins/myPlugin.js
*/
import { featureCollection, feature } from '@turf/turf';
import { Map } from './map';
import LoadingScreen from './loading.js';

export const initMissionBuilder = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new MissionBuilder(el));
};

class MissionBuilder {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;
    this.loadingEl = document.querySelector('.loading-screen');

    this.categoryEls = this.el.querySelectorAll('.js-category');
    this.locationTaskEls = this.el.querySelectorAll('.js-task-location');

    this.mapEl = this.el.querySelector('.js-map');
    this.map = new Map(this.mapEl);

    this.markers = [];

    this.init();
  }

  async init() {
    const legs = Array.from(this.locationTaskEls).map(taskEl => {
      const title = taskEl.dataset.title;
      const location = taskEl.dataset.location;
      const taskId = taskEl.dataset.taskId;
      const latitude = taskEl.dataset.latitude;
      const longitude = taskEl.dataset.longitude;

      const categoryEls = taskEl.querySelectorAll('.js-category');

      return {
        title,
        location,
        taskId,
        endLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        categories: Array.from(categoryEls).map(categoryEl => categoryEl.value),
      };
    });

    await this.map.addLegs(legs);

    await this.syncCheckboxesWithMap();
    this.endLoadingScreen();

    this.categoryEls.forEach(categoryEl => {
      categoryEl.addEventListener('change', (event) => {
        this.syncCheckboxesWithMap();
      });
    });
  }

  async syncCheckboxesWithMap() {
    // begin loading.
    const checkedCategoryNames = Array.from(this.categoryEls)
      .filter(categoryEl => categoryEl.checked)
      .map(categoryEl => categoryEl.value);

    this.map.updateCategoryNames(checkedCategoryNames);
    await this.map.updateMap();
    // end loading.
  }

  endLoadingScreen() {
    if (!this.loader) {
      this.loader = new LoadingScreen(this.loadingEl);

      this.loader.endLoading()
    }
  }

}

