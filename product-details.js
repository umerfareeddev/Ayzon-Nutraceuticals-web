// ======================================================
// AYZONE PRODUCT DETAILS ENGINE
// Part 1
// ======================================================

// ---------------------------
// URL Parameters
// ---------------------------

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ---------------------------
// DOM Elements
// ---------------------------

const productImage = document.getElementById("dynamic-p-img");
const productBadge = document.getElementById("dynamic-p-badge");
const productTitle = document.getElementById("dynamic-p-title");

const detailsWrapper = document.getElementById(
    "dynamic-info-cards-wrapper"
);

const relatedGrid = document.querySelector(".related-grid");
const notFoundBox = document.getElementById("product-not-found");

// Current Product
let currentProduct = null;

// ======================================================
// Find Product
// ======================================================

function getProductById(id) {
    return AYZONE_PRODUCTS.find(product => product.id === id);
}

// ======================================================
// Product Not Found
// ======================================================

function showNotFound() {
    document.querySelector(".main-detail-box").style.display = "none";
    document.querySelector(".related-products-sec").style.display = "none";
    notFoundBox.style.display = "block";

}

// ======================================================
// Render Product Basic Information
// ======================================================

function renderProduct(product) {
    productImage.src = product.img;
    productImage.alt = product.title;
    productBadge.innerText = product.category;
    productTitle.innerText = product.title;
}

// =====================================================
// Render Detail Cards
// ======================================================

function renderDetails(product) {
    detailsWrapper.innerHTML = "";
    const detailEntries = Object.entries(product.details);
    detailEntries.forEach(([title, value]) => {
        const card = document.createElement("div");
        card.className = "info-card";
        card.innerHTML = `
            <h3>${title}</h3>
            <p>${value}</p>
        `;
        detailsWrapper.appendChild(card);
    });

}

// ======================================================
// Render Gallery
// ======================================================

const galleryContainer = document.getElementById("dynamic-gallery");

function renderGallery(product) {
    if (!galleryContainer) return;

    galleryContainer.innerHTML = "";

    if (!product.gallery || product.gallery.length === 0) return;

    product.gallery.forEach((image, index) => {
        const thumb = document.createElement("img");

        thumb.src = image;
        thumb.alt = product.title;
        thumb.className = "gallery-thumb";

        if (index === 0) {
            thumb.classList.add("active");
        }

        thumb.addEventListener("click", () => {
            productImage.src = image;

            document.querySelectorAll(".gallery-thumb").forEach(img => {
                img.classList.remove("active");
            });

            thumb.classList.add("active");
        });

        galleryContainer.appendChild(thumb);
    });
}

// ======================================================
// Related Products
// ======================================================

function renderRelatedProducts(product) {
    relatedGrid.innerHTML = "";

    let relatedProducts = AYZONE_PRODUCTS.filter(item => {
        return item.category.toLowerCase() === product.category.toLowerCase() &&
            item.id !== product.id;
    });

    if (relatedProducts.length < 4) {
        const extraProducts = AYZONE_PRODUCTS.filter(item => {
            return item.id !== product.id &&
                !relatedProducts.includes(item);
        });

        relatedProducts = [...relatedProducts, ...extraProducts];
    }

    relatedProducts.slice(0, 4).forEach(item => {
        const card = document.createElement("a");

        card.href = `product-details.html?id=${item.id}`;
        card.className = "rel-card";

        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <h4>${item.title}</h4>
            <p>${item.category}</p>
        `;

        relatedGrid.appendChild(card);
    });
}

const zoomBox = document.querySelector(".detail-left-img");
const zoomImg = zoomBox.querySelector("img");

zoomBox.addEventListener("mousemove", (e) => {

    const rect = zoomBox.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    zoomImg.style.transformOrigin = `${x}% ${y}%`;
    zoomImg.style.transform = "scale(2)";
});

zoomBox.addEventListener("mouseleave", () => {
    zoomImg.style.transform = "scale(1)";
    zoomImg.style.transformOrigin = "center";
});

// ======================================================
// Previous & Next Product
// ======================================================

const prevProductBtn = document.getElementById("prev-product");
const nextProductBtn = document.getElementById("next-product");

function renderProductNavigation(product) {

    const currentIndex = AYZONE_PRODUCTS.findIndex(item => item.id === product.id);

    const prevIndex = currentIndex === 0
        ? AYZONE_PRODUCTS.length - 1
        : currentIndex - 1;

    const nextIndex = currentIndex === AYZONE_PRODUCTS.length - 1
        ? 0
        : currentIndex + 1;

    const prevProduct = AYZONE_PRODUCTS[prevIndex];
    const nextProduct = AYZONE_PRODUCTS[nextIndex];

    prevProductBtn.href = `product-details.html?id=${prevProduct.id}`;
    nextProductBtn.href = `product-details.html?id=${nextProduct.id}`;

    prevProductBtn.innerHTML = `← ${prevProduct.title}`;
    nextProductBtn.innerHTML = `${nextProduct.title} →`;
}

// ======================================================
// Initialize Page
// ======================================================

function initProductPage() {
    if (typeof AYZONE_PRODUCTS === "undefined") {
        console.error("AYZONE_PRODUCTS not found.");
        return;
    }

    currentProduct = getProductById(productId);

    if (!currentProduct) {
        showNotFound();
        return;
    }

    renderProduct(currentProduct);
    renderDetails(currentProduct);
    renderGallery(currentProduct);
    renderRelatedProducts(currentProduct);
    renderProductNavigation(currentProduct);
}

initProductPage();