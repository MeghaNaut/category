let URL =
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json";
let data = null;

async function fetchData() {
  try {
    let response = await fetch(URL);
    data = await response.json();

    if (data && data.categories) {
      loadProducts(data.categories);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function loadProducts(categories) {
  const cardContainer = document.getElementById("product-cards");
  cardContainer.innerHTML = "";
  cardContainer.classList.add("cardContainer");
  categories.forEach((category) => {
    category.category_products.forEach((product) => {
      createProductCard(product);
    });
  });
}

function createProductCard(product) {
  const cardContainer = document.getElementById("product-cards");
  const card = document.createElement("div");
  card.className = "product-card";
  const badgeHtml = product.badge_text
    ? `<div class="badge">${product.badge_text}</div>`
    : "";

  card.innerHTML = `
        <img src="${
          product.image || "placeholder.jpg"
        }" alt="Product Image" class="product-image">
         ${badgeHtml}
         <div class="title">
        <h2 class="product-title">${product.title.slice(0, 10)}.</h2>
        <li class="vendor">Vendor: ${product.vendor}</li>
        </div>
        <div class="rate">
        <p class="price">Rs ${product.price}.00</p>
        <p class="compare-price">${product.compare_at_price}.00</p>
        <p class="discount">${calculateDiscount(
          product.price,
          product.compare_at_price
        )}% off</p>
        </div>
        <button class="add-to-cart">Add to Cart</button>
    `;

  cardContainer.appendChild(card);
}

function calculateDiscount(originalPrice, compareAtPrice) {
  return Math.round(((compareAtPrice - originalPrice) / compareAtPrice) * 100);
}

document.addEventListener("DOMContentLoaded", function () {
  const menTab = document.querySelector(".men");
  const womenTab = document.querySelector(".women");
  const kidTab = document.querySelector(".kid");

  menTab.addEventListener("click", function () {
    filterProducts("Men");
    removeActiveClass();
    menTab.classList.add("active");
  });

  womenTab.addEventListener("click", function () {
    filterProducts("Women");
    removeActiveClass();
    womenTab.classList.add("active");
  });

  kidTab.addEventListener("click", function () {
    filterProducts("Kids");
    removeActiveClass();
    kidTab.classList.add("active");
  });

  function removeActiveClass() {
    [menTab, womenTab, kidTab].forEach((tab) => {
      tab.classList.remove("active");
    });
  }
});

function filterProducts(categoryName) {
  const filteredProducts = data.categories.find(
    (category) => category.category_name === categoryName
  );

  if (filteredProducts) {
    loadProducts([filteredProducts]);
  } else {
    console.error(`No products found for category: ${categoryName}`);
  }
}

fetchData();
