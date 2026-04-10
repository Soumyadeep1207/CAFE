const STORAGE_KEYS = {
    cart: "cafenity_cart",
    draft: "cafenity_order_draft",
    lastOrder: "cafenity_last_order"
};

const menuItems = {
    espresso: {
        id: "espresso",
        name: "Classic Espresso",
        price: 120,
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=80"
    },
    "caramel-cappuccino": {
        id: "caramel-cappuccino",
        name: "Smoked Caramel Cappuccino",
        price: 199,
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
    },
    "hazelnut-iced-latte": {
        id: "hazelnut-iced-latte",
        name: "Hazelnut Iced Latte",
        price: 210,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
    },
    "vanilla-cold-brew": {
        id: "vanilla-cold-brew",
        name: "Vanilla Cold Brew",
        price: 190,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80"
    },
    "pesto-paneer-sandwich": {
        id: "pesto-paneer-sandwich",
        name: "Pesto Paneer Sandwich",
        price: 260,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80"
    },
    "farmhouse-waffle": {
        id: "farmhouse-waffle",
        name: "Loaded Farmhouse Waffle",
        price: 245,
        image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80"
    },
    "blueberry-muffin": {
        id: "blueberry-muffin",
        name: "Blueberry Crumble Muffin",
        price: 145,
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80"
    },
    "butter-croissant": {
        id: "butter-croissant",
        name: "Butter Croissant",
        price: 135,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80"
    },
    "baked-cheesecake": {
        id: "baked-cheesecake",
        name: "Baked Cheesecake",
        price: 220,
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80"
    },
    "fudge-brownie": {
        id: "fudge-brownie",
        name: "Fudge Brownie",
        price: 160,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"
    }
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
});

const cartItemsElement = document.querySelector("#window-cart-items");
const subtotalElement = document.querySelector("#window-subtotal");
const taxElement = document.querySelector("#window-tax");
const totalElement = document.querySelector("#window-total");
const itemCountElement = document.querySelector("#window-item-count");
const statusElement = document.querySelector("#window-status");
const orderNumberElement = document.querySelector("#window-order-number");
const nameElement = document.querySelector("#window-name");
const phoneElement = document.querySelector("#window-phone");
const emailElement = document.querySelector("#window-email");
const paymentElement = document.querySelector("#window-payment");
const orderTypeElement = document.querySelector("#window-order-type");
const pickupElement = document.querySelector("#window-pickup");
const notesElement = document.querySelector("#window-notes");
const confirmationTitleElement = document.querySelector("#window-confirmation-title");
const confirmationTextElement = document.querySelector("#window-confirmation-text");
const clearCartButton = document.querySelector("#window-clear-cart");
const refreshButton = document.querySelector("#refresh-window");

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

function calculateSummary(cart) {
    const items = Object.entries(cart).map(([id, quantity]) => ({
        ...menuItems[id],
        quantity
    }));
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxesAndFees = subtotal > 0 ? Math.round(subtotal * 0.08) + 18 : 0;
    const total = subtotal + taxesAndFees;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { items, subtotal, taxesAndFees, total, itemCount };
}

function renderCartItems(cart) {
    const summary = calculateSummary(cart);

    if (summary.items.length === 0) {
        cartItemsElement.innerHTML = '<p class="empty-state">Your cart is empty. Add items from the main menu page.</p>';
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

    subtotalElement.textContent = formatCurrency(summary.subtotal);
    taxElement.textContent = formatCurrency(summary.taxesAndFees);
    totalElement.textContent = formatCurrency(summary.total);
    itemCountElement.textContent = String(summary.itemCount);
}

function renderDraft(draft) {
    nameElement.textContent = draft.customerName || "Not entered yet";
    phoneElement.textContent = draft.phone || "Not entered yet";
    emailElement.textContent = draft.email || "Not entered yet";
    paymentElement.textContent = draft.paymentMethod ? draft.paymentMethod.toUpperCase() : "Not selected yet";
    orderTypeElement.textContent = draft.orderType || "Not selected yet";
    pickupElement.textContent =
        draft.pickupDate && draft.pickupTime ? `${draft.pickupDate} at ${draft.pickupTime}` : "Not set yet";
    notesElement.textContent = draft.notes || "No special instructions added.";
}

function renderLastOrder(lastOrder) {
    if (!lastOrder) {
        statusElement.textContent = "Draft";
        orderNumberElement.textContent = "Pending";
        confirmationTitleElement.textContent = "Waiting for order confirmation";
        confirmationTextElement.textContent =
            "Fill customer details on the main page, then place the order to see the final summary here.";
        return;
    }

    statusElement.textContent = "Confirmed";
    orderNumberElement.textContent = lastOrder.orderNumber;
    confirmationTitleElement.textContent = `Order ${lastOrder.orderNumber} confirmed`;
    confirmationTextElement.textContent =
        `${lastOrder.customer.customerName} placed a ${lastOrder.customer.orderType} order on ${lastOrder.createdAt}. ` +
        `Payment: ${String(lastOrder.customer.paymentMethod).toUpperCase()}. Total bill: ${formatCurrency(lastOrder.summary.total)}.`;
}

function refreshWindow() {
    const cart = loadJson(STORAGE_KEYS.cart, {});
    const draft = loadJson(STORAGE_KEYS.draft, {});
    const lastOrder = loadJson(STORAGE_KEYS.lastOrder, null);
    renderCartItems(cart);
    renderDraft(draft);
    renderLastOrder(lastOrder);
}

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

    const cart = loadJson(STORAGE_KEYS.cart, {});
    const currentQuantity = cart[itemId] || 0;

    if (action === "increase") {
        cart[itemId] = currentQuantity + 1;
    } else if (action === "decrease") {
        if (currentQuantity <= 1) {
            delete cart[itemId];
        } else {
            cart[itemId] = currentQuantity - 1;
        }
    } else if (action === "remove") {
        delete cart[itemId];
    }

    saveJson(STORAGE_KEYS.cart, cart);
    refreshWindow();
});

clearCartButton.addEventListener("click", () => {
    saveJson(STORAGE_KEYS.cart, {});
    refreshWindow();
});

refreshButton.addEventListener("click", refreshWindow);

window.addEventListener("storage", refreshWindow);

refreshWindow();
