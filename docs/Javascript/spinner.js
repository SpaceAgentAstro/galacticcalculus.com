const chatSpinner = document.getElementById('chat-spinner');

const MIN_SPINNER_DURATION = 300;
let spinnerStartTime;

const showSpinner = () => {
    spinnerStartTime = Date.now();
    chatSpinner.classList.add('visible');
};

const hideSpinner = () => {
    const elapsedTime = Date.now() - spinnerStartTime;
    const remainingTime = Math.max(0, MIN_SPINNER_DURATION - elapsedTime);

    setTimeout(() => {
        chatSpinner.classList.remove('visible');
    }, remainingTime);
};
