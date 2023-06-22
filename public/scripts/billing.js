const input = document.querySelector("#name-search");
const list = document.querySelector("#product");

function throttle(fn, delay) {
  let handle = null;
  let prevArgs = undefined;

  return function () {
    prevArgs = arguments;
    if (!handle) {
      fn(...prevArgs);
      prevArgs = null;
      handle = setInterval(() => {
        if (!prevArgs) {
          handle = clearInterval(handle);
        } else {
          fn(...prevArgs);
          prevArgs = null;
        }
      }, delay);
    }
  };
}

let product;

input.addEventListener("input", async (e) => {
  if (input.value == "") {
    return null;
  }
  list.innerHTML = "";
  const response = await fetch("/api/inventory/name/" + input.value);
  const data = await response.json();
  product = data;
  data.forEach((element) => {
    const option = document.createElement("option");
    option.setAttribute("value", element.name);
    option.innerText = `Name:${element.name} | Price: ${element.price}`;
    list.appendChild(option);
  });
});
