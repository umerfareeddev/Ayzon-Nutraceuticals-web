// 1. URL se product ki ID nikalna
const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get('id');

// 2. HTML Elements ko select karna jahan data show karna hai
const imageSelector = document.getElementById('dynamic-p-img');
const badgeSelector = document.getElementById('dynamic-p-badge');
const titleSelector = document.getElementById('dynamic-p-title');
const compositionSelector = document.getElementById('dynamic-p-comp');
const descriptionSelector = document.getElementById('dynamic-p-desc');
const relatedGrid = document.querySelector('.related-grid');

if (currentId) {
    // 3. index.html se live cards ka data fetch karna
    fetch('index.html')
        .then(response => response.text())
        .then(htmlText => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const allCards = doc.querySelectorAll('.sec-3-3-1');
            let selectedCard = null;

            // 4. Sequential loop laga kar clicked product dhoondhna
            allCards.forEach(card => {
                const clickAttr = card.getAttribute('onclick');
                if (clickAttr && clickAttr.includes(`id=${currentId}`)) {
                    selectedCard = card;
                }
            });

            if (selectedCard) {
                // 5. Card se details extract karna
                const imgSrc = selectedCard.querySelector('.img img').getAttribute('src');
                const imgAlt = selectedCard.querySelector('.img img').getAttribute('alt');
                const catText = selectedCard.querySelector('.contant p:first-of-type').innerText;
                const titleText = selectedCard.querySelector('.contant h1').innerText;
                const compText = selectedCard.querySelector('.contant p:last-of-type').innerText;

                // 6. UI par actual data render karna
                imageSelector.src = imgSrc;
                imageSelector.alt = imgAlt;
                badgeSelector.innerText = catText;
                titleSelector.innerText = titleText;
                compositionSelector.innerText = compText;
                descriptionSelector.innerText = `${titleText} is premium quality health supplement manufactured under standard nutraceutical observe configurations.`;

                // 7. DYNAMIC RELATED PRODUCTS GENERATION
                let relatedHTML = '';
                let count = 0;

                allCards.forEach(card => {
                    const clickAttr = card.getAttribute('onclick');
                    const cardCategory = card.getAttribute('data-category');
                    const selectedCategory = selectedCard.getAttribute('data-category');

                    // Same category ke doosre items dhoondhna (max 2 items)
                    if (cardCategory === selectedCategory && !clickAttr.includes(`id=${currentId}`) && count < 4) {
                        const rImg = card.querySelector('.img img').getAttribute('src');
                        const rTitle = card.querySelector('.contant h1').innerText;
                        const rCat = card.querySelector('.contant p:first-of-type').innerText;

                        let rLink = 'product-details.html';
                        if (clickAttr) {
                            const match = clickAttr.match(/'([^']+)'/);
                            if (match) rLink = match[1];
                        }

                        relatedHTML += `
                            <a href="${rLink}" class="rel-card">
                                <img src="${rImg}" alt="${rTitle}">
                                <h4>${rTitle}</h4>
                                <p>${rCat}</p>
                            </a>
                        `;
                        count++;
                    }
                });

                // Related products container mein html dalna
                if (relatedHTML !== '') {
                    relatedGrid.innerHTML = relatedHTML;
                } else {
                    relatedGrid.innerHTML = '<p style="color:#666; font-size:14px;">No matching related items found.</p>';
                }

            } else {
                titleSelector.innerText = "Product Not Found";
            }
        })
        .catch(err => {
            titleSelector.innerText = "Error loading data structure";
            console.error(err);
        });
}