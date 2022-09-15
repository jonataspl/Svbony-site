function c(el) {
  // facilitador para querySelector
  return document.querySelector(el);
}
/**
 * facilitador para querySelectorAll
 * @param {*} selector - Um seletor CSS
 * @returns Returna uma lista de elementos HTML
 */
function cs(selector) {
  return document.querySelectorAll(selector);
}
let modalQnt = 1;

let cart = [];

let itemKey = 0;

let itemSelected = null;

telescopeJson.map((item, index) => {
  // prencher as informações em teleItem do telescope.js
  let teleItem = c(".models .telescope-item").cloneNode(true);

  // puxa o ID dos produtos do telescope.js
  teleItem.setAttribute("data-key", index);

  // puxa as imagens e passa o source para o src do HTML
  teleItem.querySelector(".telescope-item--img img").src = item.img;

  teleItem.querySelector(
    ".telescope-item--price"
  ).innerHTML = `U$ ${item.price.toFixed(2)}`;

  teleItem.querySelector(".telescope-item--name").innerHTML = item.name;
  teleItem.querySelector(".telescope-item--desc").innerHTML = item.description;

  teleItem.querySelector("a").addEventListener("click", (e) => {
    // preventDafault tira a atualização a cada click no link
    e.preventDefault();

    // vai sair do elemento 'a' e ir para o telescope item e puxar o atributo "data-key"
    let key = e.target.closest(".telescope-item").getAttribute("data-key");

    modalQnt = 1;

    itemKey = key;

    c(".telescopeBig img").src = telescopeJson[key].img;
    c(".telescopeInfo h1").innerHTML = telescopeJson[key].name;
    c(".telescopeInfo--desc").innerHTML = telescopeJson[key].description;
    c(".telescopeInfo--actualPrice").innerHTML = `U$ ${telescopeJson[
      key
    ].price.toFixed(2)}`;

    const father = document.querySelector(".telescopeInfo--sizes");

    father.innerHTML = "";
    telescopeJson[key].sizes?.forEach((size, index) => {
      const sizeEl = document.createElement("div");

      sizeEl.addEventListener("click", (e) => {
        //  sizeEl.classList.toggle("selected");
        const sons = Array.from(father.children);
        console.log(sons);
        sons.forEach((child) => {
          child.classList.remove("selected");
        });
        // adiciona a classe selected no que vc clicou
        e.target.classList.add("selected");
        itemSelected = index;
      });

      sizeEl.classList.add("telescopeInfo--size");
      sizeEl.textContent = size;
      sizeEl.setAttribute(
        "style",
        "display: inline-flex; border-radius: 10px;, overflow: hidden;"
      );

      father.appendChild(sizeEl);
      if (index == 0) {
        sizeEl.classList.add("selected");
      }
    });

    c(".telescopeInfo--qt").innerHTML = modalQnt;

    c(".telescopeWindowArea").style.opacity = 0;
    c(".telescopeWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".telescopeWindowArea").style.opacity = 1;
    }, 200);
  });
  c(".telescope-area").append(teleItem);
});

function closeBox() {
  c(".telescopeWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".telescopeWindowArea").style.display = "none";
  }, 500);
}

cs(".telescopeInfo--cancelButton, .telescopeInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeBox);
  }
);

c(".telescopeInfo--qtmenos").addEventListener("click", () => {
  if (modalQnt > 1) {
    modalQnt--;
    c(".telescopeInfo--qt").innerHTML = modalQnt;
  }
});

c(".telescopeInfo--qtmais").addEventListener("click", () => {
  modalQnt++;
  c(".telescopeInfo--qt").innerHTML = modalQnt;
});

c(".telescopeInfo--addButton").addEventListener("click", () => {
  let identifier = itemKey + "@" + itemSelected;

  let keyVerification = cart.findIndex(
    (item) => (item.identifier = identifier)
  );

  if (keyVerification > -1) {
    cart[keyVerification].Qnt += modalQnt;
  } else {
    cart.push({
      identifier,
      id: itemKey,
      size: itemSelected,
      Qnt: modalQnt,
    });
  }
  closeBox();
});
