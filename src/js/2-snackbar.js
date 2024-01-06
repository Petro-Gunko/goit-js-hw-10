import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const delayInput = form.elements['delay'];
        const delay = parseInt(delayInput.value);

        const stateInput = form.elements['state'];
        const state = stateInput.value;

        try {
            const result = await new Promise((resolve, reject) => {
                if (state === 'fulfilled') {
                    setTimeout(() => {
                        resolve(delay);
                    }, delay);
                } else {
                    setTimeout(() => {
                        reject(delay);
                    }, delay);
                }
                form.reset();
            });

            iziToast.success({
                title: 'Success',
                message: `✅ Fulfilled promise in ${result}ms`,
                position: 'topRight'
            });

        } catch (error) {
            iziToast.error({
                title: 'Error',
                message: `❌ Rejected promise in ${error}ms`,
                position: 'topRight'
            });
        }
    });
});