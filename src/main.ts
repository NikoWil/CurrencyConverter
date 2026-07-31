function clear_child_elements(dom_elem: HTMLElement) {
    while (dom_elem.firstChild) {
        dom_elem.removeChild(dom_elem.lastChild as ChildNode);
    }
}

function get_date(): Date | undefined {
    const date_elem = document.getElementById('date');
    if (!date_elem || !(date_elem instanceof HTMLInputElement)) {
        console.error('Missing date input with ID "date"');
        return;
    }

    const date_str = date_elem.value;
    const date = date_str ? new Date(date_str) : new Date();
    return date;
}

function clear_result() {
    const result_div = document.getElementById('conversionResult');
    if (!result_div) {
        console.error('Missing div with ID "conversionResult"');
        return;
    }

    clear_child_elements(result_div);
}

function display_text(text: string) {
    clear_result();

    const result_div = document.getElementById('conversionResult');
    if (!result_div) {
        console.error('Missing div with ID "conversionResult"')
        return;
    }

    const paragraph = document.createElement('p');
    const textNode = document.createTextNode(text);

    paragraph.appendChild(textNode);
    result_div.appendChild(paragraph);
}

function display_missing_currency_error() {
    display_text('Error: missing from or to value!');
}

function display_invalid_currency_error(from: string, to: string, date: Date) {
    display_text(`Error: the conversion from "${from}" to "${to}" is not defined for date "${date}"`);
}

function display_converted_amount(from: string, to: string, amount: number, converted: number) {
    display_text(`${amount} ${from} are ${converted} ${to}.`);
}

async function get_conversion_rate() {
    const from_elem = document.getElementById('fromCurrency');
    const to_elem = document.getElementById('toCurrency');

    if (!from_elem || !(from_elem instanceof HTMLInputElement) || !to_elem || !(to_elem instanceof HTMLInputElement)) {
        console.error('Missing from or to currency field in the document');
        return;
    }

    const from = from_elem.value.toUpperCase();
    const to = to_elem.value.toUpperCase();

    if (!from || !to) {
        display_missing_currency_error();
        return;
    }

    const date = get_date();
    if (!date) {
        return;
    }

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

    const amount_elem = document.getElementById('amount');
    if (!amount_elem || !(amount_elem instanceof HTMLInputElement)) {
        console.error('Missing element with id "amount"');
        return;
    }

    const amount_str = amount_elem.value;
    const amount = Number(amount_str);

    const converted = amount * conversion_rate;

    display_converted_amount(from, to, amount, converted);
}

async function populate_fields() {
    const url = 'https://api.frankfurter.dev/v2/currencies';
    const res = await fetch(url);
    const data = await res.json();

    const dataList = document.getElementById('currencyList');
    if (!dataList) {
        console.error('Missing element with id "currencyList"');
        return;
    }

    for (const item of data) { // You can use `let` instead of `const` if you like
        const entry = document.createElement('option');
        entry.setAttribute('value', item.iso_code);
        dataList.appendChild(entry);
    }
}

function log_element(name: string, elem: any) {
    console.log(`${name} type: ${Object.prototype.toString.call(elem)}`);
    console.log(`${name}: ${elem}`);
}