import "bootstrap";
import "../plugins/flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import { dynamicNavbar } from '../components/navbar';
import { dynamicfooter } from '../components/footer';
import { initMap } from './plugins/map';

dynamicNavbar();
dynamicFooter();
initMap('.js-map');
