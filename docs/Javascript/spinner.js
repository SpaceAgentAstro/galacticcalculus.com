const chatSpinner = document.getElementById('chat-spinner');

const MIN_SPINNER_DURATION = 300;
let spinnerStartTime;
let spinnerTimeoutId;

const showSpinner = () => {
  spinnerStartTime = Date.now();
  chatSpinner.classList.add('visible');
  spinnerTimeoutId = setTimeout(() => {
    hideSpinner();
  }, MIN_SPINNER_DURATION);
};

const hideSpinner = () => {
  if (spinnerTimeoutId) {
    clearTimeout(spinnerTimeoutId);
  }
  chatSpinner.classList.remove('visible');
  spinnerTimeoutId = null;
};

const toggleSpinner = (isVisible) => {
  if (isVisible) {
    showSpinner();
  } else {
    hideSpinner();
  }
};

const isSpinnerVisible = () => {
  return chatSpinner.classList.contains('visible');
};

const resetSpinner = () => {
  hideSpinner();
  spinnerStartTime = null;
};

const getSpinnerDuration = () => {
  if (spinnerStartTime) {
    return Date.now() - spinnerStartTime;
  }
  return 0;
};