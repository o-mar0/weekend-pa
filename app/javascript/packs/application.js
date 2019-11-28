import "bootstrap";

import { initMap } from './plugins/map';
import { initMission } from './plugins/mission';

// Always add a js- prefixed class to your elements when targeting to create a separation
// of concerns between classes you use to style and classes you use to do javascript.
initMap('.js-map');
initMission('.js-cards')

