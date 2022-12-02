var modalQnt = 1;

const cart = [];

var itemKey = 0;

var itemSelected = 0;

function c(el) {
  // facilitador para querySelector
  return document.querySelector(el);
}
/**
 * facilitador para querySelectorAll
 * @param {*} selector - Um seconstor CSS
 * @returns Returna uma lista de elementos HTML
 */
function cs(selector) {
  return document.querySelectorAll(selector);
}

function diminuirQntCart() {
  if (modalQnt > 1) {
    modalQnt--;
    c(".telescopeInfo--qt").innerHTML = modalQnt;
  }
}

function aumentarQntCart() {
  modalQnt++;
  c(".telescopeInfo--qt").innerHTML = modalQnt;
}

function adicionarCarrinho() {
  const identifier = telescopeJson[itemKey].id + "@" + itemSelected;

  const keyVerification = cart.findIndex(
    (item) => item.identifier == identifier
  );
  //verificação de quantidade de itens no carrinho para tirar do carrinho ou fechar o carrinho
  if (keyVerification > -1) {
    cart[keyVerification].Qnt += modalQnt;
  } else {
    cart.push({
      identifier,
      id: telescopeJson[itemKey].id,
      size: itemSelected,
      Qnt: modalQnt,
    });
  }
  itemSelected = 0;
  atualizarCarrinho();
  fecharModal();
}

function atualizarCarrinho() {
  c(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    c("aside").classList.add("show");

    c(".cart").innerHTML = "";

    var subtotal = 0;

    var desconto = 0;

    var total = 0;
    // Funcionamento do carrinho
    for (const i in cart) {
      const teleItem = telescopeJson.find((item) => item.id == cart[i].id);
      subtotal += teleItem.price[cart[i].size] * cart[i].Qnt;
      const cartItem = c(".models .cart--item").cloneNode(true);
      var teleSizeName;
      switch (cart[i].size) {
        case 0:
          teleSizeName = "Tamanho 1";
          break;
        case 1:
          teleSizeName = "Tamanho 2";
          break;
        case 2:
          teleSizeName = "Tamanho 3";
          break;
        case null:
          teleSizeName = "Tamanho 1";
          break;
      }

      const teleName = `${teleItem.name} (${teleSizeName})`;

      cartItem.querySelector("img").src = teleItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = teleName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].Qnt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].Qnt > 1) {
            cart[i].Qnt--;
          } else {
            cart.splice(i, 1);
          }
          atualizarCarrinho();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].Qnt++;
          atualizarCarrinho();
        });
      //cartItem.querySelector(".cart--item-preco").innerHTML = teleItem.price;

      c(".cart").append(cartItem);
    }
    desconto = subtotal * 0;
    total = subtotal - desconto;

    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c("aside").classList.remove("show");
    c("aside").style.left = "100vw";
  }
}
function fecharModal() {
  c(".telescopeWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".telescopeWindowArea").style.display = "none";
  }, 500);
}
function abrirMenuMob() {
  if (cart.length > 0) {
    c("aside").style.left = "0";
  }
}
function fecharMenuMob() {
  c("aside").style.left = "100vw";
}

telescopeJson.map((item, index) => {
  // prencher as informações em teleItem do telescope.js
  const teleItem = c(".models .telescope-item").cloneNode(true);

  // puxa o ID dos produtos do telescope.js
  teleItem.setAttribute("data-key", index);

  // puxa as imagens e passa o source para o src do HTML
  teleItem.querySelector(".telescope-item--img img").src = item.img;

  teleItem.querySelector(
    ".telescope-item--price"
  ).innerHTML = `R$ ${item.price[0].toFixed(2)}`;

  teleItem.querySelector(".telescope-item--name").innerHTML = item.name;
  teleItem.querySelector(".telescope-item--desc").innerHTML = item.description;

  teleItem.querySelector("a").addEventListener("click", (e) => {
    // preventDafault tira a atualização a cada click no link
    e.preventDefault();

    // vai sair do elemento 'a' e ir para o telescope item e puxar o atributo "data-key"
    const key = e.target.closest(".telescope-item").getAttribute("data-key");

    modalQnt = 1;
    itemKey = key;

    c(".telescopeBig img").src = telescopeJson[key].img;
    c(".telescopeInfo h1").innerHTML = telescopeJson[key].name;
    c(".telescopeInfo--desc").innerHTML = telescopeJson[key].description;
    var priceModal = (c(".telescopeInfo--actualPrice").innerHTML =
      telescopeJson[key].price[0].toFixed(2));

    //Dar o select no tamanho/opção do produto
    const father = document.querySelector(".telescopeInfo--sizes");

    father.innerHTML = "";
    telescopeJson[key].sizes?.forEach((size, index) => {
      const sizeEl = document.createElement("div");

      sizeEl.addEventListener("click", (e) => {
        //  sizeEl.classList.toggle("selected");
        const sons = Array.from(father.children);
        sons.forEach((child) => {
          child.classList.remove("selected");
        });
        // adiciona a classe selected no que vc clicou
        e.target.classList.add("selected");
        itemSelected = index;
        priceModal = c(".telescopeInfo--actualPrice").innerHTML =
          telescopeJson[key].price[itemSelected].toFixed(2);
      });

      // animação da seleção
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

cs(".telescopeInfo--cancelButton").forEach((item) => {
  item.addEventListener("click", fecharModal);
});
cs(".telescopeInfo--cancelMobileButton").forEach((item) => {
  item.addEventListener("click", fecharModal);
});
c(".telescopeInfo--qtmenos").addEventListener("click", diminuirQntCart);
c(".telescopeInfo--qtmais").addEventListener("click", aumentarQntCart);
c(".telescopeInfo--addButton").addEventListener("click", adicionarCarrinho);
c(".menu-openner").addEventListener("click", abrirMenuMob);
c(".menu-closer").addEventListener("click", fecharMenuMob);
