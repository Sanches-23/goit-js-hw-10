import { PREP_TIME } from './js/menu.js';

const formEl = document.querySelector('.form');
const orderLog = document.querySelector('.order-log');

function makeOrder(delay, shouldResolve) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (shouldResolve) {
        res(delay);
      } else {
        rej(delay);
      }
    }, delay);
  });
}

function addOrderRow(drink) {
  const liEl = document.createElement('li');
  liEl.className = 'row-pending';
  liEl.textContent = `⏳ ${drink} · у роботі…`;
  orderLog.append(liEl);
  return liEl;
}

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const drink = formData.get('drink');
  const state = formData.get('state');
  const delay = PREP_TIME[drink];
  const shouldResolve = state === 'fulfilled';
  const row = addOrderRow(drink);
  makeOrder(delay, shouldResolve)
    .then(delay => {
      row.className = 'row-ok';
      row.textContent = `✅ ${drink} · готове · ${delay} ms`;
    })
    .catch(delay => {
      row.className = 'row-err';
      row.textContent = `❌ ${drink} · скасовано · ${delay} ms`;
    })
    .finally(() => {
      row.textContent += ` · ${new Date().toLocaleTimeString('uk-UA')}`;
    });
});