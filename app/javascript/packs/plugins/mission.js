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

    this.categoryCardEls = this.el.querySelectorAll('.js-category-card');
    this.locationTaskEls = this.el.querySelectorAll('.js-task-location');

    this.mapEl = this.el.querySelector('.js-map');
    this.map = new Map(this.mapEl);
    this.nextEl = this.el.querySelector('.js-next-btn');
    this.finalStepEl = this.el.querySelector('.js-final-step');

    this.currentMissionLeg = 0;
    this.currentMissionLegStep = 0;

    this.markers = [];

    this.init();
  }

  async init() {
    await this.drawLegsOnMap();
    this.displayMissionStep();

    this.nextEl.addEventListener('click', () => {
      const legEl = this.locationTaskEls[this.currentMissionLeg];

      if (!legEl) {
        return;
      }

      const maxStepCountInLeg = legEl.querySelectorAll('.js-category-card').length;

      if (this.currentMissionLegStep >= maxStepCountInLeg) {
        this.currentMissionLeg ++;
        this.currentMissionLegStep = 0;
      }
      else {
        this.currentMissionLegStep += 1;
      }

      this.displayMissionStep();
      this.updateMap();
    });
  }

  async drawLegsOnMap() {
    const legs = Array.from(this.locationTaskEls).map(taskEl => {
      const taskId = taskEl.dataset.taskId;
      const latitude = taskEl.dataset.latitude;
      const longitude = taskEl.dataset.longitude;

      const categoryEls = taskEl.querySelectorAll('.js-category');

      return {
        taskId,
        endLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        categories: Array.from(categoryEls).map(categoryEl => categoryEl.dataset.categoryName),
      };
    });

    await this.map.addLegs(legs);

    const allCategoryEls = document.querySelectorAll('.js-category');
    const allCategoryNames = Array.from(allCategoryEls)
      .map(categoryEl => categoryEl.dataset.categoryName);

    await this.map.updateCategoryNames(allCategoryNames);
    return this.updateMap();
  }

  updateMap() {
    if (!this.locationTaskEls[this.currentMissionLeg]) {
      this.map.zoomIntoFinalLeg();
    }
    else {
      this.map.zoomIntoLeg(this.currentMissionLeg);
    }
  }

  displayMissionStep() {
    this.locationTaskEls.forEach(locationTaskEl => locationTaskEl.classList.add('d-none'));
    this.categoryCardEls.forEach(categoryCardEl => categoryCardEl.classList.add('d-none'));

    const legEl = this.locationTaskEls[this.currentMissionLeg];

     // Reached the finish line!
    if (!legEl) {
      this.finalStepEl.classList.remove('d-none');
      this.nextEl.classList.add('d-none');
      return;
    }

    legEl.classList.remove('d-none');
    const legStepEl = legEl.querySelectorAll('.js-category-card')[this.currentMissionLegStep];

    if (legStepEl) {
      legStepEl.classList.remove('d-none');
      this.map.highlightCategoryMarker(legStepEl.dataset.categoryName);
    }
    else {
      legEl.querySelector('.js-location-card').classList.remove('d-none');
      this.map.highlightTaskLocationMarker(legEl.dataset.taskId);
    }
  }

}

