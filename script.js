const STORAGE_KEYS = {
    cart: "cafenity_cart",
    draft: "cafenity_order_draft",
    lastOrder: "cafenity_last_order",
    reservations: "cafenity_reservations",
    catering: "cafenity_catering_requests",
    loyalty: "cafenity_loyalty_signups"
};

const menuItems = {
    espresso: {
        id: "espresso",
        name: "Classic Espresso",
        price: 120,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=80"
    },
    "caramel-cappuccino": {
        id: "caramel-cappuccino",
        name: "Smoked Caramel Cappuccino",
        price: 199,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
    },
    "hazelnut-iced-latte": {
        id: "hazelnut-iced-latte",
        name: "Hazelnut Iced Latte",
        price: 210,
        category: "cold",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
    },
    "vanilla-cold-brew": {
        id: "vanilla-cold-brew",
        name: "Vanilla Cold Brew",
        price: 190,
        category: "cold",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80"
    },
    "pesto-paneer-sandwich": {
        id: "pesto-paneer-sandwich",
        name: "Pesto Paneer Sandwich",
        price: 260,
        category: "food",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80"
    },
    "farmhouse-waffle": {
        id: "farmhouse-waffle",
        name: "Loaded Farmhouse Waffle",
        price: 245,
        category: "food",
        image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80"
    },
    "blueberry-muffin": {
        id: "blueberry-muffin",
        name: "Blueberry Crumble Muffin",
        price: 145,
        category: "bakery",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80"
    },
    "butter-croissant": {
        id: "butter-croissant",
        name: "Butter Croissant",
        price: 135,
        category: "bakery",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80"
    },
    "baked-cheesecake": {
        id: "baked-cheesecake",
        name: "Baked Cheesecake",
        price: 220,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80"
    },
    "fudge-brownie": {
        id: "fudge-brownie",
        name: "Fudge Brownie",
        price: 160,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"
    }
};

const state = {
    activeFilter: "all",
    searchTerm: "",
    cart: loadJson(STORAGE_KEYS.cart, {}),
    cartWindowRef: null
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
});

const cartItemsElement = document.querySelector("#cart-items");
const subtotalAmountElement = document.querySelector("#subtotal-amount");
const taxAmountElement = document.querySelector("#tax-amount");
const totalAmountElement = document.querySelector("#total-amount");
const heroCartCountElement = document.querySelector("#hero-cart-count");
const heroCartTotalElement = document.querySelector("#hero-cart-total");
const navCartCountElement = document.querySelector("#nav-cart-count");
const navCartTotalElement = document.querySelector("#nav-cart-total");
const clearCartButton = document.querySelector("#clear-cart-button");
const filterChips = document.querySelectorAll(".filter-chip");
const searchInput = document.querySelector("#search-input");
const menuCards = document.querySelectorAll(".menu-card");
const orderForm = document.querySelector("#order-form");
const confirmationBox = document.querySelector("#confirmation-box");
const confirmationTitle = document.querySelector("#confirmation-title");
const confirmationText = document.querySelector("#confirmation-text");
const pickupDateInput = document.querySelector("#pickup-date-input");
const pickupTimeInput = document.querySelector("#pickup-time-input");
const orderTypeSelect = document.querySelector("#order-type-select");
const cartWindowButtons = document.querySelectorAll("#open-cart-window, #open-cart-hero, #open-cart-checkout");
const reservationForm = document.querySelector("#reservation-form");
const reservationMessage = document.querySelector("#reservation-message");
const cateringForm = document.querySelector("#catering-form");
const cateringMessage = document.querySelector("#catering-message");
const loyaltyForm = document.querySelector("#loyalty-form");
const loyaltyMessage = document.querySelector("#loyalty-message");

function loadJson(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(value) {
    return `Rs. ${currencyFormatter.format(value)}`;
}

function getCartEntries() {
    return Object.entries(state.cart).map(([id, quantity]) => ({
        ...menuItems[id],
        quantity
    }));
}

function calculateSummary() {
    const items = getCartEntries();
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxesAndFees = subtotal > 0 ? Math.round(subtotal * 0.08) + 18 : 0;
    const total = subtotal + taxesAndFees;

    return {
        items,
        subtotal,
        taxesAndFees,
        total,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
}

function syncCart() {
    saveJson(STORAGE_KEYS.cart, state.cart);
}

function saveDraft() {
    const formData = new FormData(orderForm);
    const draft = Object.fromEntries(formData.entries());
    saveJson(STORAGE_KEYS.draft, draft);
}

function renderCart() {
    const summary = calculateSummary();

    if (summary.items.length === 0) {
        cartItemsElement.innerHTML = '<p class="empty-state">Your cart is empty. Add something delicious to begin.</p>';
    } else {
        cartItemsElement.innerHTML = summary.items.map((item) => `
            <article class="cart-item">
                <div class="cart-item-main">
                    <img class="cart-thumb" src="${item.image}" alt="${item.name}">
                    <div>
                    <h4>${item.name}</h4>
                    <p>${formatCurrency(item.price)} each</p>
                    <div class="cart-item-actions">
                        <div class="qty-control" aria-label="Quantity controls for ${item.name}">
                            <button class="qty-button" type="button" data-action="decrease" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-button" type="button" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="text-button remove-button" type="button" data-action="remove" data-id="${item.id}">
                            Remove
                        </button>
                    </div>
                    </div>
                </div>
                <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </article>
        `).join("");
    }

    subtotalAmountElement.textContent = formatCurrency(summary.subtotal);
    taxAmountElement.textContent = formatCurrency(summary.taxesAndFees);
    totalAmountElement.textContent = formatCurrency(summary.total);
    heroCartCountElement.textContent = String(summary.itemCount);
    heroCartTotalElement.textContent = formatCurrency(summary.total);
    navCartCountElement.textContent = `${summary.itemCount} item${summary.itemCount === 1 ? "" : "s"}`;
    navCartTotalElement.textContent = formatCurrency(summary.total);
}

function updateItemQuantity(itemId, delta) {
    const currentQuantity = state.cart[itemId] || 0;
    const nextQuantity = currentQuantity + delta;

    if (nextQuantity <= 0) {
        delete state.cart[itemId];
    } else {
        state.cart[itemId] = nextQuantity;
    }

    syncCart();
    renderCart();
}

function addToCart(itemId) {
    state.cart[itemId] = (state.cart[itemId] || 0) + 1;
    syncCart();
    renderCart();
}

function flashAddButton(button) {
    if (!button) {
        return;
    }

    const originalText = button.textContent;
    button.textContent = "Added";
    button.classList.add("is-added");

    window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("is-added");
    }, 900);
}

function clearCart() {
    state.cart = {};
    syncCart();
    renderCart();
}

function applyMenuFilters() {
    const searchTerm = state.searchTerm.trim().toLowerCase();

    menuCards.forEach((card) => {
        const category = card.dataset.category;
        const name = (card.dataset.name || "").toLowerCase();
        const matchesFilter = state.activeFilter === "all" || category === state.activeFilter;
        const matchesSearch = !searchTerm || name.includes(searchTerm);

        card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
    });
}

function setDefaultDateAndTime() {
    const draft = loadJson(STORAGE_KEYS.draft, {});
    const hasDraftDate = draft.pickupDate && draft.pickupTime;
    if (hasDraftDate) {
        pickupDateInput.value = draft.pickupDate;
        pickupTimeInput.value = draft.pickupTime;
        return;
    }

    const now = new Date();
    const minPickup = new Date(now.getTime() + (30 * 60 * 1000));
    const roundedPickup = new Date(Math.ceil(minPickup.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000));
    pickupDateInput.value = roundedPickup.toISOString().split("T")[0];

    const hours = String(roundedPickup.getHours()).padStart(2, "0");
    const minutes = String(roundedPickup.getMinutes()).padStart(2, "0");
    pickupTimeInput.value = `${hours}:${minutes}`;
}

function restoreDraft() {
    const draft = loadJson(STORAGE_KEYS.draft, {});

    Array.from(orderForm.elements).forEach((field) => {
        if (!field.name || !(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
            return;
        }
        if (draft[field.name]) {
            field.value = draft[field.name];
        }
    });
}

function validateOrder(formData, summary) {
    const phone = (formData.get("phone") || "").trim();

    if (summary.items.length === 0) {
        return "Add at least one menu item before placing the order.";
    }

    if (!/^\d{10}$/.test(phone)) {
        return "Enter a valid 10-digit phone number.";
    }

    return "";
}

function openCartWindow() {
    const features = "width=1100,height=860,left=120,top=60,resizable=yes,scrollbars=yes";
    state.cartWindowRef = window.open("cart.html", "cafenityCartWindow", features);
    if (state.cartWindowRef) {
        state.cartWindowRef.focus();
    }
}

function appendRecord(storageKey, payload) {
    const existing = loadJson(storageKey, []);
    existing.push(payload);
    saveJson(storageKey, existing);
}

function showInlineMessage(element, title, body) {
    if (!element) {
        return;
    }
    element.hidden = false;
    element.innerHTML = `<h3>${title}</h3><p>${body}</p>`;
}

function handleOrderSubmit(event) {
    event.preventDefault();

    const summary = calculateSummary();
    const formData = new FormData(orderForm);
    const error = validateOrder(formData, summary);

    if (error) {
        confirmationBox.hidden = false;
        confirmationTitle.textContent = "Unable to place order";
        confirmationText.textContent = error;
        return;
    }

    const orderNumber = `CAF${Math.floor(1000 + Math.random() * 9000)}`;
    const order = {
        orderNumber,
        createdAt: new Date().toLocaleString("en-IN"),
        customer: Object.fromEntries(formData.entries()),
        summary
    };

    saveJson(STORAGE_KEYS.lastOrder, order);
    confirmationBox.hidden = false;
    confirmationTitle.textContent = `Order ${orderNumber} confirmed`;
    confirmationText.textContent =
        `${order.customer.customerName}, your ${order.customer.orderType} order for ${summary.itemCount} item(s) is confirmed. ` +
        `Open the cart window to see the full bill and final order summary.`;

    openCartWindow();
}

document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
        addToCart(button.dataset.id);
        flashAddButton(button);
    });
});

cartItemsElement.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }

    const itemId = target.dataset.id;
    const action = target.dataset.action;

    if (!itemId || !action) {
        return;
    }

    if (action === "increase") {
        updateItemQuantity(itemId, 1);
    } else if (action === "decrease") {
        updateItemQuantity(itemId, -1);
    } else if (action === "remove") {
        delete state.cart[itemId];
        syncCart();
        renderCart();
    }
});

clearCartButton.addEventListener("click", clearCart);

filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        state.activeFilter = chip.dataset.filter || "all";
        filterChips.forEach((item) => item.classList.toggle("is-active", item === chip));
        applyMenuFilters();
    });
});

searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    applyMenuFilters();
});

orderTypeSelect.addEventListener("change", () => {
    const isPickup = orderTypeSelect.value === "pickup";
    pickupDateInput.required = isPickup;
    pickupTimeInput.required = isPickup;
    saveDraft();
});

orderForm.addEventListener("input", saveDraft);
orderForm.addEventListener("submit", handleOrderSubmit);

cartWindowButtons.forEach((button) => button.addEventListener("click", openCartWindow));

if (reservationForm) {
    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(reservationForm);
        const payload = Object.fromEntries(formData.entries());
        appendRecord(STORAGE_KEYS.reservations, {
            ...payload,
            createdAt: new Date().toLocaleString("en-IN")
        });
        showInlineMessage(
            reservationMessage,
            "Reservation request received",
            `${payload.reservationName}, your table request for ${payload.guestCount} guest(s) on ${payload.reservationDate} at ${payload.reservationTime} has been saved.`
        );
        reservationForm.reset();
    });
}

if (cateringForm) {
    cateringForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(cateringForm);
        const payload = Object.fromEntries(formData.entries());
        appendRecord(STORAGE_KEYS.catering, {
            ...payload,
            createdAt: new Date().toLocaleString("en-IN")
        });
        showInlineMessage(
            cateringMessage,
            "Catering request sent",
            `Thanks ${payload.cateringName}. Your request for ${payload.headCount} guests on ${payload.eventDate} has been recorded.`
        );
        cateringForm.reset();
    });
}

if (loyaltyForm) {
    loyaltyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(loyaltyForm);
        const payload = Object.fromEntries(formData.entries());
        appendRecord(STORAGE_KEYS.loyalty, {
            ...payload,
            createdAt: new Date().toLocaleString("en-IN")
        });
        showInlineMessage(
            loyaltyMessage,
            "You joined the Cafenity list",
            `${payload.loyaltyName}, you will now receive updates about new menu drops, offers, and cafe events.`
        );
        loyaltyForm.reset();
    });
}

window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.cart) {
        state.cart = loadJson(STORAGE_KEYS.cart, {});
        renderCart();
    }
    if (event.key === STORAGE_KEYS.draft) {
        restoreDraft();
    }
});

setDefaultDateAndTime();
restoreDraft();
saveDraft();
renderCart();
applyMenuFilters();
