const slides = document.querySelector(".slides");
const slideEls = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let index = 0;
let interval;

slideEls.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function updateSlider() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
}

function nextSlide() {
    index = (index + 1) % slideEls.length;
    updateSlider();
}

function prevSlide() {
    index = (index - 1 + slideEls.length) % slideEls.length;
    updateSlider();
}

function goToSlide(i) {
    index = i;
    updateSlider();
    resetAuto();
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAuto();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAuto();
    });
}

function startAuto() {
    interval = setInterval(nextSlide, 8000);
}

function resetAuto() {
    clearInterval(interval);
    startAuto();
}

const sliderWrapper = document.querySelector(".bg-slider");

sliderWrapper.addEventListener("mouseenter", () => clearInterval(interval));
sliderWrapper.addEventListener("mouseleave", startAuto);

startAuto();


// Navbar scroll effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector("nav");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


// product change filter

// const filterLinks = document.querySelectorAll(".sec-3-2 a");
// const products = document.querySelectorAll(".sec-3-3-1");
// const loader = document.querySelector(".product-loader");

// filterLinks.forEach(link => {
//     link.addEventListener("click", function (e) {
//         e.preventDefault();

//         // active tab
//         filterLinks.forEach(l => l.classList.remove("active"));
//         this.classList.add("active");

//         const filter = this.dataset.filter;

//         // hide products & show loader
//         document.querySelector(".sec-3-3").style.display = "none";
//         loader.style.display = "flex";

//         setTimeout(() => {
//             loader.style.display = "none";
//             document.querySelector(".sec-3-3").style.display = "flex";

//             products.forEach(product => {
//                 if (filter === "all") {
//                     product.style.display = "block";
//                 } else {
//                     product.style.display =
//                         product.dataset.category === filter ? "block" : "none";
//                 }
//             });
//         }, 500); // loader duration
//     });
// });





// scroll auto counter

const counters = document.querySelectorAll(".counter");
let counterStarted = false;

function startCounting() {
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let current = 0;
        const increment = Math.ceil(target / 80);

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.innerText = current + "+";
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target + "+";
            }
        };

        updateCounter();
    });
}

window.addEventListener("scroll", () => {
    const section = document.querySelector(".section-4");
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100 && !counterStarted) {
        counterStarted = true;
        startCounting();
    }
});







// burger menu

const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-2-2');
const closeBtn = document.querySelector('.nav-2-2 ul.menu li.close-btn');

burger.addEventListener('click', () => {
    navMenu.classList.add('active'); // menu open
});

closeBtn.addEventListener('click', () => {
    navMenu.classList.remove('active'); // menu close
});

// dropdown toggle for mobile
const dropdowns = document.querySelectorAll('.nav-2-2 ul.menu li.dropdown > a');

dropdowns.forEach(drop => {
    drop.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = drop.parentElement;
        parent.classList.toggle('open');
    });
});



// =======================================================
// Dynamic Products Rendering
// =======================================================

const productGrid = document.getElementById("products-dynamic-grid");
const loader = document.querySelector(".product-loader");
const filterLinks = document.querySelectorAll(".sec-3-2 a");

function renderProducts(products) {

    if (!productGrid) return;

    productGrid.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "sec-3-3-1";
        card.dataset.category = product.category.toLowerCase();

        card.innerHTML = `

            <div class="img">
                <img src="${product.img}" alt="${product.title}">
            </div>

            <div class="contant">

                <p style="text-transform:capitalize;">
                    ${product.category}
                </p>

                <h2>${product.title}</h2>

                <p>${product.shortDescription}</p>

                <a href="product-details.html?id=${product.id}">
                    View Details
                </a>

            </div>

        `;

        card.addEventListener("click", () => {

            window.location.href =
                `product-details.html?id=${product.id}`;

        });

        productGrid.appendChild(card);

    });

}

// First Time Render

if (typeof AYZONE_PRODUCTS !== "undefined") {

    renderProducts(AYZONE_PRODUCTS);

}

// =======================================================
// Product Filter
// =======================================================

filterLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        filterLinks.forEach(btn =>
            btn.classList.remove("active"));

        this.classList.add("active");

        const category = this.dataset.filter;

        loader.style.display = "flex";
        productGrid.style.display = "none";

        setTimeout(() => {

            loader.style.display = "none";
            productGrid.style.display = "grid";
            productGrid.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
            productGrid.style.paddingLeft = "10px";
            productGrid.style.paddingRight = "10px";

            if (category === "all") {

                renderProducts(AYZONE_PRODUCTS);

            } else {

                const filtered = AYZONE_PRODUCTS.filter(product =>
                    product.category.toLowerCase() === category
                );

                renderProducts(filtered);

            }

        }, 400);

    });

});