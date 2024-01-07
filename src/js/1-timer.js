import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const startButton = document.querySelector('[data-start]');
const daysDisplay = document.querySelector('[data-days]');
const hoursDisplay = document.querySelector('[data-hours]');
const minutesDisplay = document.querySelector('[data-minutes]');
const secondsDisplay = document.querySelector('[data-seconds]');
const datetimePicker = document.getElementById('datetime-picker');

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const currentDate = new Date();
        const userSelectedDate = selectedDates[0];
        if (userSelectedDate < currentDate) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
};

const timer = flatpickr('#datetime-picker', options);

let intervalId;

startButton.addEventListener('click', startTimer);

function startTimer() {
    const selectedDate = flatpickr.parseDate(document.getElementById('datetime-picker').value);
    const currentDate = new Date();
    
    if (selectedDate <= currentDate) {
        iziToast.error({
            title: 'Error',
            message: 'Please choose a date in the future',
        });
        return;
    }
    startButton.disabled = true;
    timer.destroy();
    intervalId = setInterval(updateTimer, 1000, selectedDate, intervalId);
}

function updateTimer(selectedDate, intervalId) {
    const currentDate = new Date();
    const difference = selectedDate - currentDate;
    if (difference <= 0) {
        clearInterval(intervalId);
        displayTimer(0, 0, 0, 0);
        return;
    }
    const { days, hours, minutes, seconds } = convertMs(difference);
    displayTimer(days, hours, minutes, seconds);
}
function displayTimer(days, hours, minutes, seconds) {
    daysDisplay.textContent = addLeadingZero(days);
    hoursDisplay.textContent = addLeadingZero(hours);
    minutesDisplay.textContent = addLeadingZero(minutes);
    secondsDisplay.textContent = addLeadingZero(seconds);
}


function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}