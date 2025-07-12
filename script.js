const productList = document.getElementById("product-list");
const loading = document.getElementById("loading");
const empty = document.getElementById("empty");
const form = document.getElementById("add-product-form");
const nameInput = document.getElementById("product-name");
const priceInput = document.getElementById("product-price");
const stockInput = document.getElementById("product-stock");
const errorBox = document.getElementById("form-error");
const duplicateAlert = document.getElementById("duplicate-alert");

let products = [];
let editIndex = null;
let deleteIndex = null;


setTimeout(() => {
  products = [
    {
      name: "Hanger",
      price: 35.0,
      stock: 5,
      image: ""
    },
    {
      name: "Desk Lamp",
      price: 50.0,
      stock: 3,
      image: ""
    },
  ];
  renderProducts(products);
}, 1000);

function renderProducts(data) {
  productList.innerHTML = "";
  loading.classList.add("d-none");

  if (data.length === 0) {
    empty.classList.remove("d-none");
    return;
  }
  empty.classList.add("d-none");

  data.forEach((product, index) => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-success fw-bold">Rp ${product.price.toLocaleString()}</p>
          <p class="card-text">Stok: ${product.stock}</p>
          <button class="btn btn-warning btn-sm" onclick="startEdit(${index})">Edit</button>
          <button class="btn btn-danger btn-sm ms-2" onclick="confirmDelete(${index})">Hapus</button>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });
}


form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const stock = parseInt(stockInput.value);


  if (!name || isNaN(price) || isNaN(stock)) {
    errorBox.textContent = "Semua input wajib diisi dengan benar.";
    return;
  }

  if (price <= 0 || stock <= 0) {
    errorBox.textContent = "Harga dan stok harus bernilai positif.";
    return;
  }

  const isDuplicate = products.some(
    (p, i) => p.name.toLowerCase() === name.toLowerCase() && i !== editIndex
  );

  if (isDuplicate) {
    duplicateAlert.classList.remove("d-none");
    return;
  }


  const newProduct = {
    name,
    price,
    stock,
    image: "https://via.placeholder.com/300x200?text=" + encodeURIComponent(name)
  };

  if (editIndex !== null) {

    products[editIndex] = newProduct;
    form.querySelector("button").textContent = "Tambah";
    editIndex = null;
  } else {

    products.push(newProduct);
  }


  renderProducts(products);
  form.reset();
  errorBox.textContent = "";
  duplicateAlert.classList.add("d-none");
});


function startEdit(index) {
  const product = products[index];
  nameInput.value = product.name;
  priceInput.value = product.price;
  stockInput.value = product.stock;

  editIndex = index;
  form.querySelector("button").textContent = "Update Produk";
}


function confirmDelete(index) {
  deleteIndex = index;
  const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  deleteModal.show();
}


document.getElementById("confirmDelete").addEventListener("click", function () {
  if (deleteIndex !== null) {
    products.splice(deleteIndex, 1);
    renderProducts(products);
    deleteIndex = null;
  }

  const modalElement = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
  modalElement.hide();
});
