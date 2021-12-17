const paginationElement = document.querySelector('.pagination');
const { paginators } = paginationElement.dataset;

const createPagination = () => {
  const paginatorsArray = paginators.split(',');

  const pagination = paginatorsArray.map(
    (paginator, index) => `<li>
      <a data-pn=${index} class='page-number'>${paginator}</a>
    </li>`,
  );

  paginationElement.innerHTML = `
    <ul>
      ${pagination.join('')}
    </ul>
  `;
};

createPagination();
