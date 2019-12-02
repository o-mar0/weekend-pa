import flatpickr from "flatpickr";
import "flatpickr/dist/themes/airbnb.css";

flatpickr(".datepicker", {
    enableTime: true,
    dateFormat: "d-m-Y H:i",
    disableMobile: true,
});
