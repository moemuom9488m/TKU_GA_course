/* --- CART PERSISTENCE HELPERS --- */
function getCart() {
    try {
        var cart = localStorage.getItem('sarab_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error("Error parsing cart", e);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('sarab_cart', JSON.stringify(cart));
    } catch (e) {
        console.error("Error saving cart", e);
    }
}

function updateCartBadge() {
    var cart = getCart();
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }
    var badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
    }
    var badgeFl = document.getElementById('cartCountFl');
    if (badgeFl) {
        badgeFl.textContent = count;
    }
}

// Initial badge load
updateCartBadge();

AOS.init({
    duration: 680,
    once: true,
    offset: 55
});

/* NAVBAR SCROLL & ACTIVE LINK  */
window.addEventListener('scroll', function() {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('btt').classList.toggle('show', window.scrollY > 300);
    document.querySelectorAll('section[id]').forEach(function(sec) {
        var top = sec.offsetTop - 110,
            bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            var lnk = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (lnk) lnk.classList.add('active');
        }
    });
});

/*  SMOOTH SCROLL + MOBILE NAV CLOSE  */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        // GA4 tracking for navigation clicks
        var linkText = this.textContent.trim();
        if (linkText.toLowerCase().indexOf('order now') !== -1) {
            gtag('event', 'click_order_now', {
                'link_text': linkText,
                'link_url': href
            });
        } else if (this.classList.contains('nav-link')) {
            gtag('event', 'nav_click', {
                'link_text': linkText,
                'link_url': href
            });
        }

        var t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            // Close Bootstrap mobile navbar if open
            var navCollapse = document.getElementById('navmenu');
            if (navCollapse && navCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    navCollapse.classList.remove('show');
                }
            }
            // Scroll after slight delay to let navbar close
            setTimeout(function() {
                window.scrollTo({
                    top: t.offsetTop - 78,
                    behavior: 'smooth'
                });
            }, 50);
        }
    });
});


var searchOv = document.getElementById('searchOv');

document.getElementById('navSearchBtn').addEventListener('click', function() {
    searchOv.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
        document.getElementById('searchInput').focus();
    }, 220);
});

document.getElementById('searchClose').addEventListener('click', closeSearch);

// Close when clicking backdrop
searchOv.addEventListener('click', function(e) {
    if (e.target === searchOv) closeSearch();
});

function closeSearch() {
    searchOv.classList.remove('open');
    document.body.style.overflow = '';
}

// Category buttons inside search box
document.querySelectorAll('.sovcat').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.sovcat').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        var f = this.getAttribute('data-cat');
        closeSearch();
        setTimeout(function() {
            filterMenu(f);
            document.getElementById('menu').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    });
});

// Trending tags fill the search input and trigger search
document.querySelectorAll('.sovtrend .ttag').forEach(function(t) {
    t.addEventListener('click', function() {
        var q = this.textContent.trim();
        document.getElementById('searchInput').value = q;
        performSearch(q);
    });
});

// Perform closed search on local menu items
function performSearch(query) {
    query = query.trim().toLowerCase();
    
    // Update URL query parameter without page reload
    var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    if (query) {
        newUrl += '?q=' + encodeURIComponent(query);
    }
    window.history.pushState({ path: newUrl }, '', newUrl);

    // Backup original text on first search
    document.querySelectorAll('.mcard').forEach(function(card) {
        var titEl = card.querySelector('.mtit');
        var descEl = card.querySelector('.mdesc');
        if (titEl && !titEl.dataset.orgText) {
            titEl.dataset.orgText = titEl.innerHTML;
        }
        if (descEl && !descEl.dataset.orgText) {
            descEl.dataset.orgText = descEl.innerHTML;
        }
    });

    // Restore original text first (remove previous highlights)
    document.querySelectorAll('.mcard').forEach(function(card) {
        var titEl = card.querySelector('.mtit');
        var descEl = card.querySelector('.mdesc');
        if (titEl && titEl.dataset.orgText) titEl.innerHTML = titEl.dataset.orgText;
        if (descEl && descEl.dataset.orgText) descEl.innerHTML = descEl.dataset.orgText;
    });

    if (!query) {
        filterMenu('all');
        return;
    }

    // GA4 tracking: view_search_results
    gtag('event', 'view_search_results', {
        'search_term': query
    });

    closeSearch();

    // Scroll to menu
    var menuSec = document.getElementById('menu');
    if (menuSec) {
        window.scrollTo({
            top: menuSec.offsetTop - 78,
            behavior: 'smooth'
        });
    }

    // Helper to highlight matching text
    function highlightString(text, kw) {
        if (!kw) return text;
        var esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(esc, 'gi'), function(m) {
            return '<mark style="background:#fff59d; padding:0 2px; border-radius:2px; color:#333;">' + m + '</mark>';
        });
    }

    // Filter menu items
    var matchedCount = 0;
    var wrappers = document.querySelectorAll('.mwrap');
    wrappers.forEach(function(w) {
        var card = w.querySelector('.mcard');
        if (!card) return;
        var title = card.getAttribute('data-title').toLowerCase();
        var desc = card.getAttribute('data-desc').toLowerCase();
        var cat = card.getAttribute('data-cat').toLowerCase();
        
        if (title.indexOf(query) !== -1 || desc.indexOf(query) !== -1 || cat.indexOf(query) !== -1) {
            w.classList.remove('gone');
            w.style.opacity = '1';
            w.style.transform = 'translateY(0)';
            matchedCount++;

            // Highlight keyword
            var titEl = card.querySelector('.mtit');
            var descEl = card.querySelector('.mdesc');
            if (titEl) titEl.innerHTML = highlightString(titEl.innerHTML, query);
            if (descEl) descEl.innerHTML = highlightString(descEl.innerHTML, query);
        } else {
            w.classList.add('gone');
        }
    });

    // Handle "No results found"
    var mgrid = document.getElementById('mgrid');
    var existingMsg = document.getElementById('searchNoResultsMsg');
    if (existingMsg) {
        existingMsg.remove();
    }

    if (matchedCount === 0) {
        // GA4 tracking: search_zero_results (Zero results search)
        gtag('event', 'search_zero_results', {
            'search_term': query
        });

        var msgHtml = document.createElement('div');
        msgHtml.id = 'searchNoResultsMsg';
        msgHtml.className = 'col-12 text-center py-5';
        msgHtml.innerHTML = `
            <div style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"><i class="fas fa-search-minus"></i></div>
            <h4 style="color: var(--dark); font-weight: 700;">No items found for "${query}"</h4>
            <p style="color: #666; font-size: 0.92rem;">Try searching for other keywords (e.g. burger, pizza, chicken, wraps, pasta, desserts)</p>
            <button class="btn-red mt-3" onclick="resetSearch()"><i class="fas fa-undo me-2"></i>Show All Items</button>
        `;
        mgrid.appendChild(msgHtml);
    }
}

// Reset search input and show all
window.resetSearch = function() {
    var searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    var existingMsg = document.getElementById('searchNoResultsMsg');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Restore original text first (remove highlights)
    document.querySelectorAll('.mcard').forEach(function(card) {
        var titEl = card.querySelector('.mtit');
        var descEl = card.querySelector('.mdesc');
        if (titEl && titEl.dataset.orgText) titEl.innerHTML = titEl.dataset.orgText;
        if (descEl && descEl.dataset.orgText) descEl.innerHTML = descEl.dataset.orgText;
    });

    // Clear query parameter from URL
    var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    filterMenu('all');
};

// Add suggestions styles dynamically
var suggestionsStyle = document.createElement('style');
suggestionsStyle.innerHTML = `
#searchSuggestions {
    background: rgba(26, 26, 26, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    margin-top: 8px;
    max-height: 220px;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: none;
    text-align: left;
}
.suggestion-item {
    padding: 12px 20px;
    color: #fff;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.suggestion-item:last-child {
    border-bottom: none;
}
.suggestion-item:hover {
    background: var(--primary);
    padding-left: 26px;
}
.suggestion-item .sug-cat {
    font-size: 0.76rem;
    color: var(--secondary);
    background: rgba(246, 166, 35, 0.15);
    padding: 2px 8px;
    border-radius: 10px;
    text-transform: uppercase;
}
.suggestion-item:hover .sug-cat {
    color: #fff;
    background: rgba(255,255,255,0.25);
}
`;
document.head.appendChild(suggestionsStyle);

// Bind search button, input enter key, and suggestions logic
document.addEventListener('DOMContentLoaded', function() {
    var sInput = document.getElementById('searchInput');
    var sBtn = document.querySelector('.sovinput button');
    var sSug = document.getElementById('searchSuggestions');
    
    // Bind click search button
    if (sBtn && sInput) {
        sBtn.addEventListener('click', function() {
            if (sSug) sSug.style.display = 'none';
            performSearch(sInput.value);
        });
    }

    // Bind input field events
    if (sInput) {
        // Hitting enter
        sInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (sSug) sSug.style.display = 'none';
                performSearch(this.value);
            }
        });

        // Autocomplete suggestions
        sInput.addEventListener('input', function() {
            var val = this.value.trim().toLowerCase();
            if (!sSug) return;

            if (!val) {
                sSug.innerHTML = '';
                sSug.style.display = 'none';
                return;
            }

            // Extract items dynamically from DOM cards to match
            var menuItems = [];
            document.querySelectorAll('.mcard').forEach(function(card) {
                var title = card.getAttribute('data-title');
                var cat = card.getAttribute('data-cat');
                if (title && menuItems.map(function(item) { return item.title; }).indexOf(title) === -1) {
                    menuItems.push({ title: title, category: cat });
                }
            });

            // Filter
            var matches = menuItems.filter(function(item) {
                return item.title.toLowerCase().indexOf(val) !== -1 || 
                       item.category.toLowerCase().indexOf(val) !== -1;
            });

            if (matches.length === 0) {
                sSug.innerHTML = '';
                sSug.style.display = 'none';
                return;
            }

            // Render matching suggestions
            sSug.innerHTML = '';
            matches.forEach(function(item) {
                var itemDiv = document.createElement('div');
                itemDiv.className = 'suggestion-item';
                itemDiv.innerHTML = '<span>' + item.title + '</span><span class="sug-cat">' + item.category + '</span>';
                itemDiv.addEventListener('click', function() {
                    sInput.value = item.title;
                    sSug.style.display = 'none';
                    sSug.innerHTML = '';
                    performSearch(item.title);
                });
                sSug.appendChild(itemDiv);
            });
            sSug.style.display = 'block';
        });
    }

    // Close suggestions on outside click
    document.addEventListener('click', function(e) {
        if (sSug && sInput && e.target !== sInput && e.target !== sSug && !sSug.contains(e.target)) {
            sSug.style.display = 'none';
        }
    });

    // Handle URL query parameter ?q= on page load
    var urlParams = new URLSearchParams(window.location.search);
    var qParam = urlParams.get('q');
    if (qParam) {
        if (sInput) sInput.value = qParam;
        
        // Wait a small delay to let page animations and DOM settle
        setTimeout(function() {
            performSearch(qParam);
        }, 600);
    }
});


$(document).ready(function() {
	$('.magnific_popup').magnificPopup({
	  disableOn: 700,
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  removalDelay: 160,
	  preloader: false,
	  fixedContentPos: false,
	  disableOn: 300
	});	
});


function filterMenu(cat) {
    // Restore original text (remove highlights)
    document.querySelectorAll('.mcard').forEach(function(card) {
        var titEl = card.querySelector('.mtit');
        var descEl = card.querySelector('.mdesc');
        if (titEl && titEl.dataset.orgText) titEl.innerHTML = titEl.dataset.orgText;
        if (descEl && descEl.dataset.orgText) descEl.innerHTML = descEl.dataset.orgText;
    });

    // Clear search input and messages if filtering from non-search source
    var existingMsg = document.getElementById('searchNoResultsMsg');
    if (existingMsg) {
        existingMsg.remove();
    }

    // GA4 tracking: select_content
    gtag('event', 'select_content', {
        'content_type': 'menu_category',
        'item_id': cat
    });

    // sync filter buttons
    document.querySelectorAll('.filtbtn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-f') === cat);
    });
    // sync category cards
    document.querySelectorAll('.catcard').forEach(function(c) {
        c.classList.toggle('active', c.getAttribute('data-filter') === cat);
    });
    // show/hide menu cards
    document.querySelectorAll('.mwrap').forEach(function(w) {
        var c = w.getAttribute('data-c');
        if (cat === 'all' || c === cat) {
            w.classList.remove('gone');
            w.style.opacity = '0';
            w.style.transform = 'translateY(16px)';
            setTimeout(function() {
                w.style.transition = 'opacity .38s,transform .38s';
                w.style.opacity = '1';
                w.style.transform = 'translateY(0)';
            }, 60);
        } else {
            w.classList.add('gone');
        }
    });
}

// Filter buttons
document.querySelectorAll('.filtbtn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterMenu(this.getAttribute('data-f'));
    });
});

// Category section cards â†’ scroll + filter
document.querySelectorAll('.catcard').forEach(function(card) {
    card.addEventListener('click', function() {
        var f = this.getAttribute('data-filter');
        window.scrollTo({
            top: document.getElementById('menu').offsetTop - 80,
            behavior: 'smooth'
        });
        setTimeout(function() {
            filterMenu(f);
        }, 480);
    });
});


var menuPop = document.getElementById('menuPop');
var mpQty = 1;

function openMenuPop(card) {
    var img = card.getAttribute('data-img');
    var title = card.getAttribute('data-title');
    var cat = card.getAttribute('data-cat');
    var price = card.getAttribute('data-price');
    var old = card.getAttribute('data-old');
    var rating = parseFloat(card.getAttribute('data-rating'));
    var reviews = card.getAttribute('data-reviews');
    var cal = card.getAttribute('data-cal');
    var time = card.getAttribute('data-time');
    var desc = card.getAttribute('data-desc');
    var tags = card.getAttribute('data-tags') || '';

    document.getElementById('mpImg').setAttribute('src', img);
    document.getElementById('mpCat').textContent = cat;
    document.getElementById('mpTitle').textContent = title;

    var full = Math.round(rating),
        empty = 5 - full;
    document.getElementById('mpStars').innerHTML =
        '<i class="fas fa-star"></i>'.repeat(full) + 'â˜†'.repeat(empty) +
        ' <span style="color:#bbb;font-size:.78rem;">' + rating + ' (' + reviews + ' reviews)</span>';

    document.getElementById('mpDesc').textContent = desc;

    document.getElementById('mpPrice').innerHTML =
        price + (old ? '<small style="color:#ccc;text-decoration:line-through;margin-left:8px;font-size:1rem;">' + old + '</small>' : '');

    document.getElementById('mpMeta').innerHTML =
        '<div class="mpm"><div class="mpmv">' + cal + ' kcal</div><div class="mpml">Calories</div></div>' +
        '<div class="mpm"><div class="mpmv">' + time + ' min</div><div class="mpml">Prep Time</div></div>' +
        '<div class="mpm"><div class="mpmv">' + rating + '/5</div><div class="mpml">Rating</div></div>';

    document.getElementById('mpTags').innerHTML =
        tags.split(',').filter(Boolean).map(function(t) {
            return '<span class="mptag">' + t.trim() + '</span>';
        }).join('');

    // GA4 tracking: view_item
    gtag('event', 'view_item', {
        'item_name': title,
        'item_category': cat,
        'price': price ? parseFloat(price.replace('$', '')) : 0
    });

    mpQty = 1;
    document.getElementById('mpQnum').textContent = 1;
    document.getElementById('mpAddCart').innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    document.getElementById('mpAddCart').style.background = '';

    menuPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Card click open popup
document.querySelectorAll('.mcard').forEach(function(card) {
    card.addEventListener('click', function() {
        openMenuPop(this);
    });
});

// + button  open popup (stop propagation to avoid double firing)
document.querySelectorAll('.madd').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        openMenuPop(this.closest('.mcard'));
    });
});

// Heart toggle (no popup)
document.querySelectorAll('.mhrt').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var ico = this.querySelector('i');
        ico.classList.toggle('far');
        ico.classList.toggle('fas');
        this.style.color = ico.classList.contains('fas') ? 'var(--primary)' : '#ccc';
    });
});

// Close popup
document.getElementById('mpClose').addEventListener('click', closeMenuPop);
menuPop.addEventListener('click', function(e) {
    if (e.target === this) closeMenuPop();
});

function closeMenuPop() {
    menuPop.classList.remove('open');
    document.body.style.overflow = '';
}

// Qty +/-
document.getElementById('mpPlus').addEventListener('click', function() {
    document.getElementById('mpQnum').textContent = ++mpQty;
});
document.getElementById('mpMinus').addEventListener('click', function() {
    if (mpQty > 1) document.getElementById('mpQnum').textContent = --mpQty;
});

// Add to cart button
document.getElementById('mpAddCart').addEventListener('click', function() {
    // Get item data
    var title = document.getElementById('mpTitle').textContent;
    var cat = document.getElementById('mpCat').textContent;
    var priceText = document.getElementById('mpPrice').textContent || '0';
    var price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    var img = document.getElementById('mpImg').getAttribute('src') || '';

    // Add to localStorage cart
    var cart = getCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title === title) {
            cart[i].quantity += mpQty;
            found = true;
            break;
        }
    }
    if (!found) {
        cart.push({
            title: title,
            category: cat,
            price: price,
            img: img,
            quantity: mpQty
        });
    }
    saveCart(cart);
    updateCartBadge();

    // GA4 tracking: add_to_cart / click_add_to_cart
    gtag('event', 'add_to_cart', {
        'item_name': title,
        'item_category': cat,
        'quantity': mpQty,
        'price': price
    });
    gtag('event', 'click_add_to_cart', {
        'item_name': title,
        'item_category': cat,
        'quantity': mpQty,
        'price': price
    });

    this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
    this.style.background = 'linear-gradient(135deg,var(--green),#1a4a35)';
    var self = this;
    setTimeout(function() {
        closeMenuPop();
        self.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        self.style.background = '';
    }, 1000);
});


document.getElementById('resBtn').addEventListener('click', function() {
    var btn = this;

    // Form validation
    var name = document.getElementById('resName').value.trim();
    var phone = document.getElementById('resPhone').value.trim();
    var email = document.getElementById('resEmail').value.trim();
    var date = document.getElementById('resDate').value.trim();
    var guests = document.getElementById('resGuests').value;
    var time = document.getElementById('resTime').value;

    var missingFields = [];
    if (!name) missingFields.push('Full Name');
    if (!phone) missingFields.push('Phone Number');
    if (!email) missingFields.push('Email Address');
    if (!date) missingFields.push('Date');

    if (missingFields.length > 0) {
        // GA4 tracking: form_error
        gtag('event', 'form_error', {
            'form_name': 'reservation',
            'error_type': 'missing_fields',
            'error_details': missingFields.join(', ')
        });
        alert('Please fill in the required fields: ' + missingFields.join(', '));
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    btn.disabled = true;
    setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Reservation';
        btn.disabled = false;
        var ok = document.getElementById('resOk');
        ok.style.display = 'block';

        // GA4 tracking: generate_lead & click_reservation
        gtag('event', 'generate_lead', {
            'form_name': 'reservation',
            'guests': guests,
            'date': date,
            'time': time
        });
        gtag('event', 'click_reservation', {
            'form_name': 'reservation',
            'guests': guests,
            'date': date,
            'time': time
        });

        ok.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 1500);
});


document.getElementById('ctcBtn').addEventListener('click', function() {
    var btn = this;

    // Form validation
    var name = document.getElementById('ctcName').value.trim();
    var email = document.getElementById('ctcEmail').value.trim();
    var subject = document.getElementById('ctcSubject').value;
    var message = document.getElementById('ctcMessage').value.trim();

    var missingFields = [];
    if (!name) missingFields.push('Your Name');
    if (!email) missingFields.push('Email Address');
    if (!message) missingFields.push('Message');

    if (missingFields.length > 0) {
        // GA4 tracking: form_error
        gtag('event', 'form_error', {
            'form_name': 'contact',
            'error_type': 'missing_fields',
            'error_details': missingFields.join(', ')
        });
        alert('Please fill in the required fields: ' + missingFields.join(', '));
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
        var ok = document.getElementById('ctcOk');
        ok.style.display = 'block';

        // GA4 tracking: contact
        gtag('event', 'contact', {
            'form_name': 'contact',
            'subject': subject
        });

        ok.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 1500);
});


var galPop = document.getElementById('galPop');
var galData = [];
var galIdx = 0;

document.querySelectorAll('.gitem').forEach(function(item) {
    galData.push({
        img: item.getAttribute('data-gimg'),
        title: item.getAttribute('data-gtitle'),
        desc: item.getAttribute('data-gdesc')
    });
    item.addEventListener('click', function() {
        openGal(parseInt(this.getAttribute('data-gi')));
    });
});

function openGal(i) {
    galIdx = i;
    var g = galData[i];
    document.getElementById('gpImg').setAttribute('src', g.img);
    document.getElementById('gpTitle').textContent = g.title;
    document.getElementById('gpDesc').innerHTML = g.desc;
    galPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

document.getElementById('gpClose').addEventListener('click', closeGal);
galPop.addEventListener('click', function(e) {
    if (e.target === this) closeGal();
});

function closeGal() {
    galPop.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('gpPrev').addEventListener('click', function() {
    openGal((galIdx - 1 + galData.length) % galData.length);
});
document.getElementById('gpNext').addEventListener('click', function() {
    openGal((galIdx + 1) % galData.length);
});

/*  ESC key closes everything */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeMenuPop();
        closeGal();
        if (typeof $.magnificPopup !== 'undefined') $.magnificPopup.close();
    }
});


new Swiper('.tesSwiper', {
    slidesPerView: 1,
    spaceBetween: 22,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    breakpoints: {
        640: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});


var cH = 8,
    cM = 45,
    cS = 30;
setInterval(function() {
    cS--;
    if (cS < 0) {
        cS = 59;
        cM--;
    }
    if (cM < 0) {
        cM = 59;
        cH--;
    }
    if (cH < 0) {
        cH = 8;
        cM = 45;
        cS = 30;
    }
    document.getElementById('cdH').textContent = String(cH).padStart(2, '0');
    document.getElementById('cdM').textContent = String(cM).padStart(2, '0');
    document.getElementById('cdS').textContent = String(cS).padStart(2, '0');
}, 1000);

/* â”€â”€ NEWSLETTER â”€â”€ */
document.getElementById('nlBtn').addEventListener('click', function() {
    var email = document.getElementById('nlEmail').value;
    if (email && email.includes('@')) {
        var btn = this;
        btn.textContent = 'âœ“ Subscribed!';
        btn.style.background = '#4ade80';
        btn.style.color = '#222';
        document.getElementById('nlEmail').value = '';
        setTimeout(function() {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    }
});

/*  NUMBER COUNTER ANIMATION*/
var numAnimated = false;
window.addEventListener('scroll', function() {
    var hero = document.getElementById('hero');
    if (!numAnimated && hero && window.scrollY > hero.offsetHeight - 300) {
        numAnimated = true;
        document.querySelectorAll('.snum').forEach(function(el) {
            var txt = el.textContent;
            var num = parseInt(txt);
            var suf = txt.replace(/[0-9]/g, '');
            if (isNaN(num)) return;
            var start = 0;
            var step = Math.ceil(num / 55);
            var iv = setInterval(function() {
                start += step;
                if (start >= num) {
                    start = num;
                    clearInterval(iv);
                }
                el.textContent = start + suf;
            }, 1400 / 55);
        });
    }
});

// GA4 tracking: click_contact_link
document.querySelectorAll('.contact-link').forEach(function(link) {
    link.addEventListener('click', function() {
        gtag('event', 'click_contact_link', {
            'link_url': this.getAttribute('href')
        });
    });
});