// Modal

const updateModal = new bootstrap.Modal(
  document.getElementById('update-modal')
);

// Inserting data table
const table = document.querySelector('#medicines');

fetch('/api/inventory')
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    data.forEach((element) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td class="align-middle">${element.name}</td>
      <td class="align-middle">${element.formula}</td>
      <td class="align-middle">Rs<span>${element.price}</span></td>
      <td class="align-middle">${element.stock}<span class="px-1">tablets</span></td>
      <td class="align-middle">
        <button class="btn btn-sm btn-success my-1">Update</button>
        <button class="btn btn-sm btn-danger my-1">Delete</button>
      </td>
      `;
      row.setAttribute('data-productID', element.productID);
      table.appendChild(row);
      row.addEventListener('click', (e) => {
        clicked(e);
      });
    });
  });

// Updating and Deleting products

// document.getElementById('this').addEventListener('click', (e) => {
//   clicked(e);
// });

const uName = document.getElementById('name');
const uFormula = document.getElementById('formula');
const uPrice = document.getElementById('price');
const uStock = document.getElementById('stock');
const uProduct = document.getElementById('product-label');

const clicked = function (e) {
  if (e.target.innerText == 'Delete') {
    const productID = e.currentTarget.getAttribute('data-productID');

    fetch('/api/inventory/id/' + productID, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productID: productID }),
    })
      .then((j) => {
        return j.json();
      })
      .then((response) => {
        location.reload();
      });
  } else if (e.target.innerText == 'Update') {
    uName.value = e.currentTarget.children[0].innerText;
    uFormula.value = e.currentTarget.children[1].innerText;
    uPrice.value = e.currentTarget.children[2].children[0].innerText;
    uStock.value = e.currentTarget.children[3].childNodes[0].data;
    uProduct.setAttribute(
      'data-id',
      e.currentTarget.getAttribute('data-productid')
    );
    updateModal.show();
  }
};

const updateForm = document.getElementById('update-form');
const submitBtn = document.getElementById('update-submit');

const putReq = (form, id) => {
  fetch('/api/inventory/id/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(form),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status == 200) {
        location.reload();
      } else {
        updateModal.hide();
        document.querySelector('.container').insertAdjacentHTML(
          'afterbegin',
          `
        <div class="alert alert-warning alert-dismissible fade show my-5" role="alert">
          <strong>Error!</strong> Something went wrong! Server has sent the following message: ${data.msg}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        );
      }
    });
};

submitBtn.addEventListener('click', () => {
  const formBody = new FormData();
  formBody.append('name', uName.value);
  formBody.append('formula', uFormula.value);
  formBody.append('price', uPrice.value);
  formBody.append('stock', uStock.value);
  putReq(formBody, uProduct.getAttribute('data-id'));
});
