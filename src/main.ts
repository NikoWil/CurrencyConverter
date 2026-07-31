import { populate_fields, convert_currencies } from './lib';

populate_fields();
document.querySelector<HTMLButtonElement>('.button1')
    ?.addEventListener('click', convert_currencies);
