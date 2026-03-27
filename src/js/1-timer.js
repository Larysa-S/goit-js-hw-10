import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const daysRef = document.querySelector('[data-days]');
const hoursRef = document.querySelector('[data-hours]');
const minsRef = document.querySelector('[data-minutes]');
const secsRef = document.querySelector('[data-seconds]');
const inputRef = document.querySelector('#datetime-picker');

let targetDate = null;
let timerId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    targetDate = selectedDates[0]; // Важливо: беремо перший елемент [0]

    if (!targetDate || targetDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      iziToast.success({
        title: 'Success',
        message: 'Date is valid! Press Start.',
        position: 'topRight',
      });
    }
  },
};

flatpickr(inputRef, options);

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  inputRef.disabled = true; // Блокуємо інпут після старту
  startCountdown(targetDate);
});

function startCountdown(date) {
  clearInterval(timerId);

  timerId = setInterval(() => {
    const diff = date - new Date();

    if (diff <= 0) {
      clearInterval(timerId);
      updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      inputRef.disabled = false;
      return;
    }

    const timeComponents = convertMs(diff);
    updateDisplay(timeComponents);
  }, 1000);
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

function updateDisplay({ days, hours, minutes, seconds }) {
  const addLeadingZero = value => String(value).padStart(2, '0');

  daysRef.textContent = addLeadingZero(days);
  hoursRef.textContent = addLeadingZero(hours);
  minsRef.textContent = addLeadingZero(minutes);
  secsRef.textContent = addLeadingZero(seconds);
}
