const SAFE_COUPON_HOSTS = new Set([
    'www.oceandrop.com.br',
    'www.sanavita.com.br',
    'www.vitafor.com.br',
    'www.truesource.com.br',
    'www.nutrify.com.br',
    'www.centralnutrition.com.br',
    'www.beltnutrition.com.br',
    'www.puravida.com.br'
]);

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = typeof text === 'string' ? text : '';
    return element;
}

function getSafeCouponUrl(value) {
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || !SAFE_COUPON_HOSTS.has(url.hostname)) return null;
        return url.href;
    } catch {
        return null;
    }
}

function getSafeAssetUrl(value, directory, allowSubdirectories = false) {
    if (typeof value !== 'string' || !value.startsWith(directory)) return null;
    if (value.includes('..') || value.includes('?') || value.includes('#')) return null;
    if (!allowSubdirectories && value.slice(directory.length).includes('/')) return null;
    if (!/\.(?:png|jpe?g|webp|svg)$/i.test(value)) return null;

    try {
        const url = new URL(value, window.location.href);
        if (url.origin !== window.location.origin || url.protocol !== window.location.protocol) return null;
        return url.href;
    } catch {
        return null;
    }
}

// Mobile menu functionality
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
});

// Function to close menu when a link is clicked
function closeMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
// Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
 }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
// Desktop menu active
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const menuLinks = document.querySelectorAll('.desktop-menu a');

    function setActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Ajuste para considerar o topo do header
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
});
// Mobile menu active
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const desktopMenuLinks = document.querySelectorAll('.desktop-menu a');
    const mobileMenuLinks = document.querySelectorAll('.menu-link-mobile');

    function setActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Ajuste para considerar o topo do header
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Atualizar links do Desktop Menu
        desktopMenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });

        // Atualizar links do Mobile Menu
        mobileMenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
});
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.menu-link-mobile');

    // Abrir o menu
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede o scroll
    });

    // Fechar o menu
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Reativa o scroll
    });

    // Fechar o menu ao clicar em um link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; // Reativa o scroll
        });
    });
});
function animateNumbers() {
  document.querySelectorAll('.selo-numero').forEach(function(el) {
    const target = Number(el.getAttribute('data-numero')) || 0;
    let count = 0;
    const increment = Math.max(1, Math.ceil(target / 40));

    function update() {
      count += increment;
      if (count >= target) {
        el.textContent = '+' + target;
        return;
      }
      el.textContent = '+' + count;
      requestAnimationFrame(update);
    }

    el.textContent = '+0';
    update();
  });
}
window.addEventListener('DOMContentLoaded', animateNumbers);

// Recommendations (merged from recomend site) - namespaced and scoped to #recomendacoes
function initRecomendacoes() {
    const section = document.getElementById('recomendacoes');
    if (!section) return;

    // Feature flag: esconder produtos de recomendação e mostrar placeholder "Em breve"
    const RECO_PRODUCTS_LOCKED = false; // toggle para false quando quiser reativar

    // Tabs
    const tabButtons = section.querySelectorAll('.reco-tab-btn');
    const tabContents = section.querySelectorAll('.reco-tab-content');

    function showTab(name) {
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === name) btn.classList.add('reco-tab-active');
            else btn.classList.remove('reco-tab-active');
        });
        tabContents.forEach(c => {
            if (c.classList.contains('reco-tab-' + name)) c.classList.remove('hidden');
            else c.classList.add('hidden');
        });
        // If switching to recommendations, load and initialize product filters
        if (name === 'recomendacoes') {
            loadAndRenderProducts().then(() => {
                initializeRecomendacoesFilters();
            });
        }
    }

    // Tab button click listeners
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.getAttribute('data-tab');
            showTab(t);
            // scroll to section when switching tabs on mobile
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // If nav link to section is clicked, open coupons by default
    document.querySelectorAll('a[href="#recomendacoes"]').forEach(a => {
        a.addEventListener('click', () => {
            // prefer coupons when navigating to the section
            showTab('coupons');
        });
    });

    // Coupons: copy buttons
    function initCouponButtons() {
        const copyBtns = section.querySelectorAll('.reco-copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const card = btn.closest('.reco-coupon-card');
                if (!card) return;
                const codeEl = card.querySelector('.font-mono');
                const code = card.dataset && card.dataset.coupon ? card.dataset.coupon : (codeEl ? codeEl.textContent.trim() : '');
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(code);
                    } else {
                        const ta = document.createElement('textarea');
                        ta.value = code;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        ta.remove();
                    }
                    const previous = btn.textContent;
                    btn.textContent = 'Copiado!';
                    setTimeout(() => btn.textContent = previous, 1200);
                } catch (e) {
                    console.warn('Copy failed', e);
                }
            });
        });
    }

    // Load and render coupons from JSON (replaces any existing static content in #reco-coupons-grid)
    async function loadAndRenderCoupons() {
        try {
            const response = await fetch('assets/lists/coupons.json');
            if (!response.ok) throw new Error('Failed to load coupons.json');
            const coupons = await response.json();
            const couponsGrid = section.querySelector('#reco-coupons-grid');
            if (!couponsGrid) return;

            couponsGrid.replaceChildren();

            coupons.forEach(coupon => {
                if (!coupon || typeof coupon !== 'object') return;
                const couponUrl = getSafeCouponUrl(coupon.url);
                if (!couponUrl || typeof coupon.brand !== 'string' || typeof coupon.code !== 'string') return;

                const card = document.createElement('div');
                card.className = 'reco-coupon-card relative p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow';
                card.setAttribute('data-coupon', coupon.code);
                card.setAttribute('data-brand', coupon.brand);

                if (typeof coupon.discount === 'string' && coupon.discount) {
                    card.appendChild(createTextElement('span', 'absolute top-4 right-4 bg-[#aa6e69] text-white text-xs font-semibold px-2 py-1 rounded', coupon.discount));
                }

                const brandWrapper = document.createElement('div');
                brandWrapper.className = 'mb-4';
                brandWrapper.appendChild(createTextElement('h4', 'font-bold text-lg accent-color', coupon.brand));
                card.appendChild(brandWrapper);

                const codeWrapper = document.createElement('div');
                codeWrapper.className = 'mb-4 p-3 bg-[#f5e8e7] rounded-lg';
                codeWrapper.appendChild(createTextElement('p', 'text-xs text-gray-600 mb-1', 'Código de desconto:'));
                codeWrapper.appendChild(createTextElement('span', 'font-mono font-bold text-sm', coupon.code));
                card.appendChild(codeWrapper);

                const actions = document.createElement('div');
                actions.className = 'flex gap-2';
                const copyButton = createTextElement('button', 'reco-copy-btn flex-1 px-3 py-2 rounded bg-[#aa6e69] text-white text-sm font-medium hover:bg-[#8e5b57] transition-colors', 'Copiar');
                copyButton.type = 'button';
                const visitLink = createTextElement('a', 'flex-1 px-3 py-2 rounded bg-[#f5e8e7] text-[#aa6e69] text-sm font-medium hover:bg-[#f0e0db] transition-colors text-center', 'Visitar');
                visitLink.href = couponUrl;
                visitLink.target = '_blank';
                visitLink.rel = 'noopener noreferrer';
                actions.append(copyButton, visitLink);
                card.appendChild(actions);

                couponsGrid.appendChild(card);
            });

        } catch (e) {
            console.warn('Failed to load or render coupons', e);
        }
    }

    // Load and render products from JSON
    async function loadAndRenderProducts() {
        try {
            // Se produtos estiverem bloqueados para lançamento, mostrar placeholder e sair
            if (RECO_PRODUCTS_LOCKED) {
                const productsGrid = section.querySelector('#reco-products-grid');
                const subcategoryFiltersContainer = section.querySelector('#reco-subcategory-filters');
                const productsTitle = section.querySelector('#reco-products-title');
                if (productsGrid) {
                    productsGrid.replaceChildren(createTextElement('div', 'w-full py-12 text-center text-gray-700 font-semibold', 'Em breve - Recomendações de produtos'));
                }
                if (subcategoryFiltersContainer) subcategoryFiltersContainer.replaceChildren();
                if (productsTitle) productsTitle.textContent = 'Em breve';
                return;
            }
            const response = await fetch('assets/lists/reco-data.json');
            const products = await response.json();
            const productsGrid = section.querySelector('#reco-products-grid');
            const subcategoryFiltersContainer = section.querySelector('#reco-subcategory-filters');
            if (!productsGrid || !subcategoryFiltersContainer) return;

            productsGrid.replaceChildren();
            subcategoryFiltersContainer.replaceChildren();

            // Map category names to normalized filter keys
            const categoryMap = {
                'Iogurte': 'iogurtes',
                'Omega': 'omega3',
                'Whey': 'whey',
                'Creatina': 'creatina',
                'Magnésio': 'magnesio',
                'Cúrcuma': 'curcuma'
            };

            // Render product cards with normalized category and subcategory
            products.forEach(product => {
                if (!product || typeof product !== 'object' || typeof product.title !== 'string') return;
                const category = typeof product.category === 'string' ? product.category : '';
                const imageUrl = getSafeAssetUrl(`assets/images/recomendacoes/${product.image_filename}`, 'assets/images/recomendacoes/');
                if (!imageUrl) return;
                const filterKey = categoryMap[category] || category.toLowerCase();
                const subcat = typeof product.subcategory === 'string' ? product.subcategory.trim() : '';
                const card = document.createElement('div');
                card.className = 'reco-product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow';
                card.setAttribute('data-category', filterKey);
                card.setAttribute('data-subcategory', subcat);
                const imageFigure = document.createElement('div');
                imageFigure.className = 'reco-img-figure';
                const image = document.createElement('img');
                image.src = imageUrl;
                image.alt = product.title;
                image.className = 'reco-img';
                image.addEventListener('error', () => {
                    image.replaceWith(createTextElement('div', 'text-xs text-gray-400', 'Imagem não carregada'));
                }, { once: true });
                imageFigure.appendChild(image);
                card.appendChild(imageFigure);

                const titleWrapper = document.createElement('div');
                titleWrapper.className = 'p-4';
                titleWrapper.appendChild(createTextElement('h4', 'font-semibold text-sm text-gray-800', product.title));
                card.appendChild(titleWrapper);
                productsGrid.appendChild(card);
            });

            // Build subcategories map from actual data
            const categorySubMap = {};
            products.forEach(product => {
                const catKey = categoryMap[product.category] || product.category.toLowerCase();
                if (!categorySubMap[catKey]) categorySubMap[catKey] = new Set();
                if (product.subcategory) categorySubMap[catKey].add(product.subcategory.trim());
            });

            // Function to apply filters
            function applyFilters() {
                const selectedCategory = document.querySelector('.reco-category-card.reco-active')?.getAttribute('data-category') || 'all';
                const selectedSubcat = document.querySelector('.reco-subcat-btn.active')?.getAttribute('data-subcat') || 'all';

                productsGrid.querySelectorAll('.reco-product-card').forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    const cardSubcat = card.getAttribute('data-subcategory');

                    const catMatch = selectedCategory === 'all' || cardCat === selectedCategory;
                    const subcatMatch = selectedSubcat === 'all' || cardSubcat === selectedSubcat;

                    card.style.display = (catMatch && subcatMatch) ? 'block' : 'none';
                });
            }

            // Function to render subcategory buttons
            function renderSubcategoryButtons() {
                subcategoryFiltersContainer.replaceChildren();
                const selectedCategory = document.querySelector('.reco-category-card.reco-active')?.getAttribute('data-category') || 'all';

                // Botão 'Todos'
                const allBtn = document.createElement('button');
                allBtn.className = 'reco-subcat-btn active px-4 py-2 rounded-full bg-[#aa6e69] text-white text-sm font-medium hover:bg-[#8e5b57] transition-colors';
                allBtn.textContent = 'Todos';
                allBtn.setAttribute('data-subcat', 'all');
                subcategoryFiltersContainer.appendChild(allBtn);

                // Botões das subcategorias
                if (selectedCategory !== 'all' && categorySubMap[selectedCategory]) {
                    Array.from(categorySubMap[selectedCategory]).sort().forEach(subcat => {
                        const btn = document.createElement('button');
                        btn.className = 'reco-subcat-btn px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors';
                        btn.textContent = subcat;
                        btn.setAttribute('data-subcat', subcat);
                        subcategoryFiltersContainer.appendChild(btn);
                    });
                }

                // Add event listeners to subcategory buttons
                subcategoryFiltersContainer.querySelectorAll('.reco-subcat-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        subcategoryFiltersContainer.querySelectorAll('.reco-subcat-btn').forEach(b => {
                            b.classList.remove('active');
                            b.classList.remove('bg-[#aa6e69]', 'text-white');
                            b.classList.add('bg-gray-200', 'text-gray-700');
                        });
                        this.classList.add('active');
                        this.classList.remove('bg-gray-200', 'text-gray-700');
                        this.classList.add('bg-[#aa6e69]', 'text-white');
                        applyFilters();
                    });
                });
            }

            // Render subcategory buttons initially
            renderSubcategoryButtons();

            // Add event listeners to category cards
            const categoryCards = section.querySelectorAll('.reco-category-card');
            categoryCards.forEach(card => {
                card.addEventListener('click', function() {
                    categoryCards.forEach(c => c.classList.remove('reco-active'));
                    this.classList.add('reco-active');
                    renderSubcategoryButtons();
                    applyFilters();
                });
            });

            // Set initial active category
            if (!section.querySelector('.reco-category-card.reco-active')) {
                section.querySelector('.reco-category-all').classList.add('reco-active');
            }

        } catch (e) {
            console.warn('Failed to load products', e);
        }
    }

    // Recomendacoes filters (kept namespaced)
    function initializeRecomendacoesFilters() {
        const filterTags = section.querySelectorAll('.reco-filter-tag');
        const productCards = section.querySelectorAll('.reco-product-card');
        const categoryCards = section.querySelectorAll('.reco-category-card');
        const productsTitle = section.querySelector('#reco-products-title');

        // avoid attaching multiple listeners
        if (initializeRecomendacoesFilters._inited) return;
        initializeRecomendacoesFilters._inited = true;

        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterTags.forEach(t => t.classList.remove('reco-active'));
                this.classList.add('reco-active');
                filterProducts(filter);
                updateTitle(filter);
            });
        });

        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                filterTags.forEach(t => t.classList.remove('reco-active'));
                categoryCards.forEach(c => c.classList.remove('reco-active'));
                this.classList.add('reco-active');
                const corresponding = section.querySelector(`.reco-filter-tag[data-filter="${category}"]`);
                if (corresponding) corresponding.classList.add('reco-active');
                filterProducts(category);
                updateTitle(category);
                section.scrollIntoView({ behavior: 'smooth' });
            });
        });

        function filterProducts(filter) {
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.remove('reco-hidden');
                } else {
                    card.classList.add('reco-hidden');
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        }

        function updateTitle(filter) {
            const titles = {
                'all': 'Todos os Produtos',
                'iogurtes': 'Iogurtes Recomendados',
                'omega3': 'Suplementos Ômega 3',
                'whey': 'Whey Protein',
                'creatina': 'Creatina',
                'magnesio': 'Magnésio'
            };
            if (productsTitle) productsTitle.textContent = titles[filter] || 'Produtos';
        }

        // init default for recommendations
        const firstTag = section.querySelector('.reco-filter-tag[data-filter="all"]');
        const firstCard = section.querySelector('.reco-category-all');
        if (firstTag) firstTag.classList.add('reco-active');
        if (firstCard) firstCard.classList.add('reco-active');
        // show all by default
        filterProducts('all');
    }

    // entry animation observer for categories/products/coupons
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    section.querySelectorAll('.reco-category-card, .reco-product-card, .reco-coupon-card').forEach(node => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(20px)';
        node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        obs.observe(node);
    });

    // initialize: show coupons tab by default, load products and coupons, then setup filters and coupon buttons
    showTab('coupons');
    loadAndRenderProducts().then(() => {
        initializeRecomendacoesFilters();
    });
    // Load coupons dynamically then initialize coupon button handlers
    loadAndRenderCoupons().then(() => {
        initCouponButtons();
    });
}

// Function to load and render convênios from JSON
async function initConvenios() {
    try {
        const response = await fetch('assets/lists/convenios-data.json');
        if (!response.ok) throw new Error('Falha ao carregar dados dos convênios');
        
        const convenios = await response.json();
        const conveniGrid = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
        
        if (!conveniGrid) return;
        
        // Clear existing content
        conveniGrid.replaceChildren();
        
        // Render each active convênio
        convenios.filter(conv => conv.ativo).forEach(convenio => {
            const logoUrl = getSafeAssetUrl(convenio.logo, 'assets/images/convenios/', false);
            if (!logoUrl || typeof convenio.nome !== 'string') return;
            const conveniSpace = document.createElement('div');
            conveniSpace.className = 'convenio-logo-space';
            const logoWrapper = document.createElement('div');
            logoWrapper.className = 'h-12 w-full flex items-center justify-center';
            const logo = document.createElement('img');
            logo.src = logoUrl;
            logo.alt = `Logo ${convenio.nome}`;
            logo.className = 'h-full object-contain';
            logoWrapper.appendChild(logo);
            conveniSpace.append(logoWrapper, createTextElement('p', 'convenio-name', convenio.nome));
            conveniGrid.appendChild(conveniSpace);
        });
    } catch (error) {
        console.error('Erro ao carregar convênios:', error);
    }
}

// Initialize convenios when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initConvenios();
});

window.addEventListener('DOMContentLoaded', initRecomendacoes);
