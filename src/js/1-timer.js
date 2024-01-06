import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    
    onClose(selectedDates) {
        let userSelectedDate = selectedDates[0];
        const currentDate = new Date();

        if (userSelectedDate < currentDate) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            document.querySelector('[data-start]').disabled = true;
        } else {
            document.querySelector('[data-start]').disabled = false;
        }
    },
};

flatpickr('#datetime-picker', options);

document.querySelector('[data-start]').addEventListener('click', startTimer);

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

    document.querySelector('[data-start]').disabled = true;
    const intervalId = setInterval(updateTimer, 1000, selectedDate);
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
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
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