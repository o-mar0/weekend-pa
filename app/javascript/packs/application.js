import "bootstrap";
import "./plugins/flatpickr"

import { initMap } from './plugins/map';
import { initMissionBuilder } from './plugins/mission-builder';
import { initMission } from './plugins/mission';
import { initNavbar } from './plugins/navbar';
import { initAutocomplete } from './plugins/init_autocomplete';
import { initStatusUpdate } from './plugins/status';
import { initAddButton } from './plugins/add-task-button';
import { initUpdateCheckbox } from './plugins/checkbox';


// Always add a js- prefixed class to your elements when targeting to create a separation
// of concerns between classes you use to style and classes you use to do javascript.
initMap('.js-map');
initMissionBuilder('.js-mission-builder-form');
initMission('.js-mission');
initNavbar('.js-navbar');
initAutocomplete();
initStatusUpdate('.js-task-status');
initAddButton('.js-btn');
initUpdateCheckbox('.js-checkbox');
