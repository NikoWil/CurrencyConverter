let count = 0;

function click_counter() {
    const id = ++count;
    console.log("Clicke-di-click No " + id + "!");
    const list = document.getElementById('myList');
    const entry = document.createElement('li');
    entry.appendChild(document.createTextNode('Clicke-di-click No ' + id + '!'));
    list.appendChild(entry);
}

function clear_clicks() {
    count = 0;

    const list = document.getElementById('myList');
    clear_child_elements(list);
}

function clear_child_elements(dom_elem) {
    while (dom_elem.firstChild) {
        dom_elem.removeChild(dom_elem.lastChild);
    }
}

function get_date() {
    const date_str = document.getElementById('date').value;
    const date = date_str ? new Date(date_str) : new Date();
    return date;
}

function clear_result() {
    const result_div = document.getElementById('conversionResult');
    clear_child_elements(result_div);
}

function display_missing_currency_error() {
    clear_result();

    const result_div = document.getElementById('conversionResult');
    const paragraph = document.createElement('p');
    const textNode = document.createTextNode('Error: missing from or to value!');

    paragraph.appendChild(textNode);
    result_div.appendChild(paragraph);
}

function display_invalid_currency_error(from, to, date) {
    clear_result();

    const result_div = document.getElementById('conversionResult');
    const paragraph = document.createElement('p');
    const textNode = document.createTextNode(`Error: the conversion from "${from}" to "${to}" is not defined for date "${date}"`);

    paragraph.appendChild(textNode);
    result_div.appendChild(paragraph);
}

function display_converted_amount(from, to, amount, converted) {
    clear_result();

    const result_div = document.getElementById('conversionResult');
    const paragraph = document.createElement('p');
    const textNode = document.createTextNode(`${amount} ${from} are ${converted} ${to}.`);

    paragraph.appendChild(textNode);
    result_div.appendChild(paragraph);
}

async function get_conversion_rate() {
    const from = document.getElementById('fromCurrency').value.toUpperCase();
    const to = document.getElementById('toCurrency').value.toUpperCase();

    if (!from || !to) {
        display_missing_currency_error();
        return;
    }

    const date = get_date();
    log_element('date', date);

    const url = `https://api.frankfurter.dev/v2/rate/${from}/${to}?date=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    //const url = 'https://api.frankfurter.dev/v1/2026-07-24?base=EUR&symbols=NOK';
    const res = await fetch(url);

    if (res.status == 422 || res.status == 404) {
        display_invalid_currency_error(from, to, date);
        return;
    }
    console.log(res);

    const data = await res.json();
    log_element('data', data);

    return [data.rate, from, to];
}

async function convert_currencies() {

    const rate_result = await get_conversion_rate();

    if (rate_result === undefined) {
        return;
    }

    const [conversion_rate, from, to] = rate_result;

    const amount_str = document.getElementById('amount').value;
    const amount = Number(amount_str);

    const converted = amount * conversion_rate;

    display_converted_amount(from, to, amount, converted);
}

async function populate_fields() {
    const url = 'https://api.frankfurter.dev/v2/currencies';
    const res = await fetch(url);
    const data = await res.json();

    const dataList = document.getElementById('currencyList');
    for (const item of data) { // You can use `let` instead of `const` if you like
        const entry = document.createElement('option');
        entry.setAttribute('value', item.iso_code);
        dataList.appendChild(entry);
    }
}

function log_element(name, elem) {
    console.log(`${name} type: ${Object.prototype.toString.call(elem)}`);
    console.log(`${name}: ${elem}`);
}