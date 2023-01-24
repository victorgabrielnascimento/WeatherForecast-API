// chama /tempo/ nomeia navbar dias
const days = {
    'Tonight': 'Noite',
    'This Afternoon': 'Manhã',
    'Overnight': 'Noite',
    'Today': 'Manhã',
    'Monday': 'Segunda',
    'Tuesday': 'Terça',
    'Wednesday': 'Quarta',
    'Thursday': 'Quinta',
    'Friday': 'Sexta',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo',
};

async function getTempo() {
    return await axios.get('/tempo').then(e => e.data);
}

//dia / dias
function getTemperatures(period, periods) {
    const _period = periods.filter(e => e.name.includes(period.name));
    const _periodTemperature = _period.slice(-1)[0].temperature; 
    const temperatures = [period.temperature, _periodTemperature];

    return temperatures.sort((a, b) => a < b ? 1 : -1);
}

async function loadTempo() {
    const data = await getTempo();
    let { periods } = data.properties;

    periods = periods.filter(e => !e.name.includes('Night')).map(period => { //evite same day
        const temperatures = getTemperatures(period, periods); // [temperaturaMin, temperaturaMax]
        period.temperature = {
            min: ((temperatures[0] - 32) * (5 / 9)).toFixed(2), //Calcula de F para C
            max: ((temperatures[1] - 32) * (5 / 9)).toFixed(2),
        };
        return period;
    });

    return periods.map(e => {
        e.name = days[e.name]; //sobreescreve
        return e;
    });
}

function highLightDay(period) {
    const [t1, t2] = document.querySelector('.temperatura-MM').querySelectorAll('span');
    const [v1, v2] = document.querySelector('.vento-MM').querySelectorAll('span');
    let [windMax, windMin] = period.windSpeed.split('mph')[0].split(' to ').map(e => parseInt(e));

    windMin = isNaN(windMin) ? windMax : windMin;
    windMin *= 1.6;
    windMax *= 1.6;

    t1.textContent = period.temperature.min;
    t2.textContent = period.temperature.max;
    v1.textContent = windMin; //Calcula mph para km/h
    v2.textContent = windMax;
    document.querySelector('#vento-atual > span').textContent = (windMin + windMax) / 2; //media vento
}

function renderTempo(periods) {
    for (const period of periods)  {
        const template = document.querySelector('.temperaturaMinTemplate').outerHTML;
        const tag = template.replace('{tempoDia}', period.name).replace('{tempoMin}', period.temperature.min).replace('{tempoMax}', period.temperature.max).replace('style="display: none;"', "");
        document.querySelector('.dias').innerHTML += tag;
    }

    document.querySelector('#temperatura-atual > span').textContent = periods[0].temperature.max /2;
    highLightDay(periods[0]);
}

function onDayClick(e) {
    const name = e.textContent.trim();
    const period = window.__periods__.filter(e => e.name == name)[0];
    highLightDay(period);
}

document.querySelector('#dia').addEventListener('click', () => {
    document.querySelectorAll('.temperaturaMin').forEach(function(e) {
        e.querySelectorAll('img')[0].style.display = 'block';
        e.querySelectorAll('img')[1].style.display = 'none';
    });
});

document.querySelector('#noite').addEventListener('click', () => {
    document.querySelectorAll('.temperaturaMin').forEach(function(e) {
        e.querySelectorAll('img')[0].style.display = 'none';
        e.querySelectorAll('img')[1].style.display = 'block';
    });
});

(async () => {
    window.__periods__ = await loadTempo();
    renderTempo(window.__periods__);
})();