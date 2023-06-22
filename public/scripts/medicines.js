// Modal

const updateModal = new bootstrap.Modal(
  document.getElementById("update-modal")
);

const logAlert = document.getElementById("log-alert");
if (logAlert != null) {
  setTimeout(() => {
    const myAlert = new bootstrap.Alert(logAlert);
    myAlert.close();
  }, 7000);
}

// Updating and Deleting products

const trs = document.querySelectorAll("tr");

trs.forEach(function(tr) {
  console.log(arguments)
  tr.addEventListener("click", (e) => {
    clicked(e);
  });
});

const uName = document.getElementById("name");
const uFormula = document.getElementById("formula");
const uPrice = document.getElementById("price");
const uStock = document.getElementById("stock");
const uProduct = document.getElementById("product-label");

const clicked = function (e) {
  if (e.target.innerText == "Delete") {
    const productID = e.currentTarget.getAttribute("data-productID");

    fetch("/api/inventory/id/" + productID, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productID: productID }),
    })
      .then((j) => {
        return j.json();
      })
      .then((response) => {
        location.reload();
      });
  } else if (e.target.innerText == "Update") {
    uName.value = e.currentTarget.children[0].innerText.trim();
    uFormula.value = e.currentTarget.children[1].innerText.trim();
    uPrice.value = e.currentTarget.children[2].children[0].innerText.trim();
    uStock.value = e.currentTarget.children[3].childNodes[0].data.trim();
    uProduct.setAttribute(
      "data-id",
      e.currentTarget.getAttribute("data-productid")
    );
    updateModal.show();
  }
};

const updateForm = document.getElementById("update-form");
const submitBtn = document.getElementById("update-submit");

const putReq = (form, id) => {
  fetch("/api/inventory/id/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
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
        document.querySelector(".container").insertAdjacentHTML(
          "afterbegin",
          `
        <div class="alert alert-danger alert-dismissible fade show my-5" role="alert">
          <strong>Error!</strong> Something went wrong! Server has sent the following message: ${data.msg}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        );
      }
    });
};

submitBtn.addEventListener("click", () => {
  const formBody = new FormData();
  formBody.append("name", uName.value);
  formBody.append("formula", uFormula.value);
  formBody.append("price", uPrice.value);
  formBody.append("stock", uStock.value);
  putReq(formBody, uProduct.getAttribute("data-id"));
});
