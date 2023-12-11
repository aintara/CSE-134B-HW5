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

class RatingWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.render();
    }

    connectedCallback() {
        let stars = this.shadowRoot.querySelectorAll('.star');
        let messageElement = this.shadowRoot.getElementById('returnmsg');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => this.handleRating(5 - index, messageElement));
        });
    }

    handleRating(value, messageElement) {
        console.log(`Selected rating: ${value}`);

        let form = document.getElementById('ratingform');

        if (value >= 4) {
            messageElement.textContent = `Thanks for the ${value} star rating!`;
        }

        else {
            messageElement.textContent = `Thanks for your feedback of ${value} stars. We'll try to do better!`;
        }

        let formData = new FormData(form);
        let headers = new Headers();
        headers.append('X-Sent-By', 'JS');

        formData.set('rating', value);
        formData.set('sentBy', 'JS');

        fetch("https://httpbin.org/post", {
            method: 'POST',
            headers: headers,
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Form', data);
        })
        .catch(error => {
            console.error('Error!', error);
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>


            #starcontainer span:hover {
                color: yellow;
            }

            #starcontainer #s1:hover ~ span{
                color: yellow;
            }

            #starcontainer #s2:hover ~ span{
                color: yellow;
            }

            #starcontainer #s3:hover ~ span{
                color: yellow;
            }

            #starcontainer #s4:hover ~ span{
                color: yellow;
            }

            #starcontainer #s5:hover ~ span{
                color: yellow;
            }
        </style>
        <div part="rating-text">Rating Widget</div>
        <div part="stars" id="starcontainer">
            <span class="star" id="s1">&#9733;</span>
            <span class="star" id="s2">&#9733;</span>
            <span class="star" id="s3">&#9733;</span>
            <span class="star" id="s4">&#9733;</span>
            <span class="star" id="s5">&#9733;</span>
        </div>
        <div id="returnmsg"></div>
        `;
    }
}
customElements.define('rating-widget', RatingWidget);

class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.render();
    }

    connectedCallback() {
        fetch('https://api.weather.gov/gridpoints/SGX/55,22/forecast', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            let forecast = data.properties.periods[0].shortForecast;
            let temp = data.properties.periods[0].temperature;
            let unit = data.properties.periods[0].temperatureUnit;
            let icon = "";
            if (forecast === "Mostly Sunny" || forecast === "Partly Cloudy") {
                icon = "🌤";
            }
            else if (forecast === "Mostly Cloudy" || forecast === "Partly Sunny") {
                icon = "🌥";
            }
            else if (forecast === "Sunny") {
                icon = "☀";
            }
            else if (forecast === "Cloudy") {
                icon = "☁️";
            }
            else {
                icon = "🌦";
            }

            let msg = `${icon} ${forecast} ${temp} \u00B0${unit}`;
            let paragraph = this.shadowRoot.getElementById('weatherinfo');
            paragraph.textContent = msg;
        })
        .catch(error => {
            console.error('Error occurred');
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
        <p id="weatherinfo">
        </p>
        `
    }
}

customElements.define('weather-widget', WeatherWidget);