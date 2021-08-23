import data from './data';

export default function runSortingCarousel() {
  const tBody = document.querySelector('tbody');
  let html = '';

  for (const item of data) {
    const imdbDigits = String(item.imdb).split('.');
    imdbDigits[1] = imdbDigits[1] ? imdbDigits[1].padEnd(2, '0') : '00';

    html += `
      <tr data-id="${item.id}" data-title="${item.title}" data-year="${item.year}" data-imdb="${item.imdb}">
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>(${item.year})</td>
        <td>imdb: ${imdbDigits.join('.')}</td>
      </tr>
    `;
  }

  tBody.insertAdjacentHTML('beforeend', html);

  const tHeadersArray = Array.from(document.getElementsByTagName('th'));
  const comparators = [];
  const tRowsArray = Array.from(tBody.rows);

  tHeadersArray.forEach((tHeader, index) => {
    const dataName = tHeader.textContent;
    const { type } = tHeader.dataset;
    let comparator;

    switch (type) {
      case 'number':
        comparator = (rowA, rowB) => rowA.dataset[dataName] - rowB.dataset[dataName];
        comparators.push({
          tHeaderIndex: index,
          order: ' ↑',
          comparator,
        });
        comparator = (rowA, rowB) => rowB.dataset[dataName] - rowA.dataset[dataName];
        comparators.push({
          tHeaderIndex: index,
          order: ' ↓',
          comparator,
        });
        break;
      case 'string':
        comparator = (rowA, rowB) => {
          if (rowA.dataset[dataName] > rowB.dataset[dataName]) {
            return 1;
          }
          return -1;
        };
        comparators.push({
          tHeaderIndex: index,
          order: ' ↑',
          comparator,
        });
        comparator = (rowA, rowB) => {
          if (rowB.dataset[dataName] > rowA.dataset[dataName]) {
            return 1;
          }
          return -1;
        };
        comparators.push({
          tHeaderIndex: index,
          order: ' ↓',
          comparator,
        });
        break;
      default:
        throw new Error(`Error! Unknown data type: ${type}.`);
    }
  });

  let currentIndex = 0;
  let lastTHeaderIndex = 0;

  setInterval(() => {
    currentIndex %= comparators.length;

    tRowsArray.sort(comparators[currentIndex].comparator);
    tRowsArray.forEach((tRow, referenceNodeIndex) => {
      const newNodeIndex = Array.prototype.indexOf.call(tBody.rows, tRow);
      tBody.insertBefore(tBody.rows[newNodeIndex], tBody.rows[referenceNodeIndex]);
    });

    tHeadersArray[lastTHeaderIndex].textContent = tHeadersArray[lastTHeaderIndex].textContent.replace(/ \S+/, '');
    tHeadersArray[comparators[currentIndex].tHeaderIndex].textContent
      += comparators[currentIndex].order;
    lastTHeaderIndex = comparators[currentIndex].tHeaderIndex;

    currentIndex += 1;
  }, 2000);
}
