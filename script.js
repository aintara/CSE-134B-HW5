let formErrors = [];
function validateAndMask(inputField, allowedPattern, errorMessage) {
    let inputValue = inputField.value;
    let errorOutput = inputField.nextElementSibling.firstChild.nextElementSibling;
    let infoOutput = errorOutput.nextElementSibling;

    let lastChar = inputValue[inputValue.length - 1];
    if (!allowedPattern.test(lastChar)) {
        formErrors.push(lastChar);
        console.log('wrong char', lastChar);
    }

    if (!allowedPattern.test(inputValue)) {
        inputField.setCustomValidity(errorMessage);
        errorOutput.textContent = errorMessage;
        errorOutput.classList.add('error-flash');
        inputField.classList.add('error-flash');
        setTimeout(function () {
            errorOutput.classList.remove('error-flash');
            inputField.classList.remove('error-flash');
            inputField.setCustomValidity('');
        }, 3000);
    } else {
        errorOutput.classList.remove('error-flash');
        inputField.classList.remove('error-flash');
        inputField.setCustomValidity('');
    }
    
    let stringLength = inputField.maxLength - inputValue.length
    infoOutput.textContent = `Remaining characters: ${stringLength}`;
    if (stringLength < 10) {
        infoOutput.classList.add('info-red');
        infoOutput.classList.remove('info-green');
        infoOutput.classList.remove('info-yellow');
    }
    if (stringLength > 9 && stringLength < 30) {
        infoOutput.classList.add('info-yellow');
        infoOutput.classList.remove('info-green');
        infoOutput.classList.remove('info-red');
    }
    if (stringLength > 29) {
        infoOutput.classList.add('info-green');
        infoOutput.classList.remove('info-red');
        infoOutput.classList.remove('info-yellow');
    }

}

let form = document.getElementById('form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let formErrorsJSON = JSON.stringify(Array.from(formErrors));

    let hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'form-errors';
    hiddenInput.value = formErrorsJSON;
    form.appendChild(hiddenInput);

    form.submit();
})

document.addEventListener('DOMContentLoaded', function() {
    let lightswitch = document.getElementById('toggleButton');
    let checkbox = document.getElementById('modeSwitch');
    lightswitch.style.opacity = '1';
    if (localStorage.getItem('isLightMode') === 'true') {
        document.body.classList.add('light-mode');
        checkbox.checked = true;
    } else {
        document.body.classList.remove('light-mode');
        checkbox.checked = false;
    }
});
document.getElementById('modeSwitch').addEventListener('change', function() {
    document.body.classList.toggle('light-mode');

    let currState = document.body.classList.contains('light-mode');
    localStorage.setItem('isLightMode', currState);
});
