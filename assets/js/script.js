const API_KEY = '28Cb07zC941agN58IkJ3govL2Zo';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
//перибирает параметры формы, помещает их во временный массив, который конвертируется 
//в строку. 
let optArray = [];

for (let entry of form.entries()) {
    // entries() метод для форм; will iterate through each  of the form entries putting it in
    // entry; нужно чтоб просто посмотреть что отображает поля формы
    if (entry[0] === 'options') {//entry[0] - первый ключ как раз таки и options
        optArray.push(entry[1]) // entry[0] ='options'  entry[1] = 'es6'
    }
}

form.delete('options') //удалить все вхождения options в наших данных формы
form.append("options", optArray.join());
//чтобы мы добавьте ключ с именем options, и значение здесь будет нашим массивом opt

return form;
}



async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
                      // https://ci-jshint.herokuapp.com/api?api_key=thisismykey
                      // https://ci-jshint.herokuapp.com/api?api_key=28Cb07zC941agN58IkJ3govL2Zo
                      // как в инструкции по методу гет;
    
    const response = await fetch(queryString);
    // ждем ответа на запрос

    const data = await response.json(); 
    // создаем новую константу в которую записываем ответ с сервера конвертированный в json

    if (response.ok) {
        displayStatus(data);

    // если все успешно 
    } else {
        displayEcxeption(data)
        throw new Error(data.error);
    }
    // если ошибка

}

function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}



async function postForm(e) {

    const form = processOptions(new FormData(document.getElementById("checksform")));

    // for (let entry of form.entries()) {
    //     console.log(entry)
    // }

    // entries() метод для форм; will iterate through each  of the form entries putting it in
    // entry; нужно чтоб просто посмотреть что отображает поля формы 

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form, // добавляем боди для передачи данных
                        });
        
        const data = await response.json();
        // конвертируем ПОСТ запрос в формат json

        if (response.ok) {
            displayErrors(data);
    
        // если все успешно 
        } else {
            displayEcxeption(data)
            throw new Error(data.error);
        }
        // если ошибка
}

function displayErrors(data) {

    let results = '';

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

function displayEcxeption(data) {
    let heading = 'An Ecxeption Occupied';

    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}