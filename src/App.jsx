import { useEffect, useMemo, useState } from "react";

const menuItems = [
  {
    id: "espresso",
    name: "Classic Espresso",
    category: "coffee",
    description: "Bright, nutty espresso with a smooth finish.",
    price: 120,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "caramel-cappuccino",
    name: "Smoked Caramel Cappuccino",
    category: "coffee",
    description: "Velvety espresso with caramel gloss and cinnamon warmth.",
    price: 199,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "hazelnut-iced-latte",
    name: "Hazelnut Iced Latte",
    category: "cold",
    description: "Chilled espresso, creamy milk, and toasted hazelnut syrup.",
    price: 210,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "vanilla-cold-brew",
    name: "Vanilla Cold Brew",
    category: "cold",
    description: "Slow-steeped coffee poured over ice with vanilla cream.",
    price: 190,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pesto-paneer-sandwich",
    name: "Pesto Paneer Sandwich",
    category: "food",
    description: "Grilled sourdough with pesto, paneer, mozzarella, and greens.",
    price: 260,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "farmhouse-waffle",
    name: "Loaded Farmhouse Waffle",
    category: "food",
    description: "Savory waffle with herb butter, vegetables, and cheese.",
    price: 245,
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "blueberry-muffin",
    name: "Blueberry Crumble Muffin",
    category: "bakery",
    description: "Soft vanilla crumb with blueberry compote and buttery topping.",
    price: 145,
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    category: "bakery",
    description: "Flaky laminated pastry baked fresh each morning.",
    price: 135,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "baked-cheesecake",
    name: "Baked Cheesecake",
    category: "dessert",
    description: "Silky vanilla cheesecake with berry glaze and cookie base.",
    price: 220,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "fudge-brownie",
    name: "Fudge Brownie",
    category: "dessert",
    description: "Dense chocolate brownie with a warm gooey middle.",
    price: 160,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"
  }
];

const initialOrder = {
  customerName: "",
  phone: "",
  email: "",
  orderType: "pickup",
  paymentMethod: "upi",
  pickupDate: "",
  pickupTime: "",
  notes: ""
};

function App() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderForm, setOrderForm] = useState(initialOrder);
  const [reservationMessage, setReservationMessage] = useState("");
  const [cateringMessage, setCateringMessage] = useState("");
  const [loyaltyMessage, setLoyaltyMessage] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    const now = new Date();
    const rounded = new Date(Math.ceil((now.getTime() + 30 * 60 * 1000) / (5 * 60 * 1000)) * (5 * 60 * 1000));
    setOrderForm((current) => ({
      ...current,
      pickupDate: rounded.toISOString().split("T")[0],
      pickupTime: `${String(rounded.getHours()).padStart(2, "0")}:${String(rounded.getMinutes()).padStart(2, "0")}`
    }));
  }, []);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return menuItems.filter((item) => {
      const filterMatch = activeFilter === "all" || item.category === activeFilter;
      const searchMatch = !term || item.name.toLowerCase().includes(term);
      return filterMatch && searchMatch;
    });
  }, [activeFilter, searchTerm]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart).map(([id, quantity]) => {
        const item = menuItems.find((entry) => entry.id === id);
        return { ...item, quantity };
      }),
    [cart]
  );

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal > 0 ? Math.round(subtotal * 0.08) + 18 : 0;
    const total = subtotal + tax;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, tax, total, itemCount };
  }, [cartItems]);

  const formatCurrency = (value) => `Rs. ${new Intl.NumberFormat("en-IN").format(value)}`;

  const addToCart = (id) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1
    }));
    setCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] || 0) + delta;
      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }
      return next;
    });
  };

  const handleOrderChange = (event) => {
    const { name, value } = event.target;
    setOrderForm((current) => ({ ...current, [name]: value }));
  };

  const handleOrderSubmit = (event) => {
    event.preventDefault();
    if (summary.itemCount === 0) {
      setOrderMessage("Please add at least one item before placing your order.");
      return;
    }
    setOrderMessage(
      `Thank you, ${orderForm.customerName || "guest"}. Your order has been received for ${orderForm.orderType} and will be prepared for ${orderForm.pickupDate} at ${orderForm.pickupTime}.`
    );
  };

  const handleReservationSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setReservationMessage(
      `${formData.get("reservationName")}, your table request for ${formData.get("guestCount")} guest(s) on ${formData.get("reservationDate")} at ${formData.get("reservationTime")} has been received.`
    );
    event.currentTarget.reset();
  };

  const handleCateringSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setCateringMessage(
      `Thank you, ${formData.get("cateringName")}. We have received your catering request for ${formData.get("headCount")} guests on ${formData.get("eventDate")}.`
    );
    event.currentTarget.reset();
  };

  const handleLoyaltySubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoyaltyMessage(
      `${formData.get("loyaltyName")}, you are now subscribed to Cafenity updates and special offers.`
    );
    event.currentTarget.reset();
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <span className="brand-mark">CAFENITY</span>
          <span className="brand-note">Crafted Coffee - Slow Moments</span>
        </div>

        <nav className="main-nav">
          <a href="#menu">Menu</a>
          <a href="#offers">Offers</a>
          <a href="#reservations">Reservations</a>
          <a href="#catering">Catering</a>
          <a href="#contact">Contact</a>
          <button className="nav-cart-button" type="button" onClick={() => setCartOpen(true)}>
            <span className="nav-cart-label">Cart</span>
            <span className="nav-cart-meta">
              <strong>{summary.itemCount} item{summary.itemCount === 1 ? "" : "s"}</strong>
              <span>{formatCurrency(summary.total)}</span>
            </span>
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Coffee, comfort, and good food</p>
            <h1>Your everyday cafe for handcrafted drinks, fresh plates, and easy ordering.</h1>
            <p className="hero-text">
              Welcome to Cafenity, a relaxed space for morning coffee runs, brunch catch-ups,
              study sessions, and evening dessert stops. Browse the menu, place an order,
              reserve a table, or get in touch for bulk and event requests.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#menu">View Menu</a>
              <button className="button button-secondary" type="button" onClick={() => setCartOpen(true)}>
                View Cart
              </button>
            </div>

            <div className="hero-highlights">
              <div>
                <strong>Fresh daily</strong>
                <span>Coffee, brunch, pastries, and desserts made to serve all day</span>
              </div>
              <div>
                <strong>Easy ordering</strong>
                <span>Order ahead for pickup or review your bill before confirming</span>
              </div>
              <div>
                <strong>For every visit</strong>
                <span>Perfect for solo coffee time, meetings, and casual gatherings</span>
              </div>
            </div>
          </div>

          <aside className="hero-card">
            <p className="card-label">Today&apos;s order preview</p>
            <h2>{summary.itemCount} item(s) ready</h2>
            <p>Review your bill, order details, and pickup information before placing the order.</p>
            <div className="price-row">
              <span className="price">{formatCurrency(summary.total)}</span>
              <span className="tag">Open daily from 9:00 AM to 10:00 PM</span>
            </div>
          </aside>
        </section>

        <section className="stats-strip">
          <article>
            <span className="stat-number">Freshly prepared</span>
            <p>From espresso and iced coffee to sandwiches, waffles, pastries, and desserts.</p>
          </article>
          <article>
            <span className="stat-number">Order ahead</span>
            <p>Place your order online and review the bill before pickup or dine-in.</p>
          </article>
          <article>
            <span className="stat-number">Warm atmosphere</span>
            <p>A welcoming cafe for quick coffee stops, long conversations, and work sessions.</p>
          </article>
        </section>

        <section className="section-shell" id="menu">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Our menu</p>
              <h2>Choose from signature coffees, fresh bakes, satisfying plates, and desserts.</h2>
            </div>
            <p className="section-note">
              Explore the menu by category and add your favorites to the cart whenever you are ready.
            </p>
          </div>

          <div className="toolbar">
            <div className="filter-group">
              {["all", "coffee", "cold", "food", "bakery", "dessert"].map((filter) => (
                <button
                  key={filter}
                  className={`filter-chip ${activeFilter === filter ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <label className="search-shell">
              <span>Find your favorite</span>
              <input
                type="search"
                placeholder="Try cappuccino, muffin, waffle"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </div>

          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article className="menu-card" key={item.id}>
                <img className="menu-image" src={item.image} alt={item.name} />
                <span className="menu-type">{item.category}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-meta">
                  <strong>{formatCurrency(item.price)}</strong>
                  <button className="button button-primary add-button" type="button" onClick={() => addToCart(item.id)}>
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="experience section-shell" id="offers">
          <div className="section-heading">
            <p className="eyebrow">Specials and highlights</p>
            <h2>Enjoy house favorites, seasonal offers, and a cafe experience worth returning for.</h2>
          </div>

          <div className="experience-layout">
            <div className="experience-panel offer-panel">
              <p className="panel-kicker">House offer</p>
              <h3>Cappuccino + Muffin Combo</h3>
              <p className="panel-text">A comforting pairing for mornings and afternoon breaks, served at a special combo price.</p>
              <div className="offer-price">
                <strong>Rs. 299</strong>
                <span>Save Rs. 45</span>
              </div>
            </div>

            <div className="experience-panel ambience-panel">
              <p className="panel-kicker">Why guests love it here</p>
              <ul className="experience-list">
                <li>Comfortable seating for quick visits or longer stays</li>
                <li>A balanced menu for coffee, light meals, and desserts</li>
                <li>Easy ordering for pickup, dine-in, and repeat visits</li>
                <li>Friendly service and a calm, welcoming atmosphere</li>
              </ul>
            </div>

            <div className="experience-panel gallery-panel">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" alt="Cafe interior" />
            </div>
          </div>
        </section>

        <section className="section-shell" id="checkout">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Your order details</p>
              <h2>Add your information and confirm your order with confidence.</h2>
            </div>
            <p className="section-note">Fill in your details below so we can prepare your order exactly the way you want it.</p>
          </div>

          <div className="checkout-layout">
            <section className="cart-panel">
              <div className="panel-header">
                <h3>Your cart</h3>
                <button className="text-button" type="button" onClick={() => setCart({})}>Clear cart</button>
              </div>

              <div className="cart-items">
                {cartItems.length === 0 ? (
                  <p className="empty-state">Your cart is empty. Add something delicious to begin.</p>
                ) : (
                  cartItems.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <div className="cart-item-main">
                        <img className="cart-thumb" src={item.image} alt={item.name} />
                        <div>
                          <h4>{item.name}</h4>
                          <p>{formatCurrency(item.price)} each</p>
                          <div className="cart-item-actions">
                            <div className="qty-control">
                              <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                              <span>{item.quantity}</span>
                              <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </article>
                  ))
                )}
              </div>

              <div className="summary-card">
                <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(summary.subtotal)}</strong></div>
                <div className="summary-row"><span>Taxes and fees</span><strong>{formatCurrency(summary.tax)}</strong></div>
                <div className="summary-row total-row"><span>Total</span><strong>{formatCurrency(summary.total)}</strong></div>
              </div>
            </section>

            <section className="form-panel">
              <h3>Customer information</h3>
              <form className="order-form" onSubmit={handleOrderSubmit}>
                <label>
                  Full name
                  <input name="customerName" value={orderForm.customerName} onChange={handleOrderChange} required />
                </label>
                <label>
                  Phone number
                  <input name="phone" value={orderForm.phone} onChange={handleOrderChange} required />
                </label>
                <label>
                  Email address
                  <input name="email" type="email" value={orderForm.email} onChange={handleOrderChange} required />
                </label>
                <div className="form-grid">
                  <label>
                    Order type
                    <select name="orderType" value={orderForm.orderType} onChange={handleOrderChange}>
                      <option value="pickup">Pickup</option>
                      <option value="dine-in">Dine-in</option>
                    </select>
                  </label>
                  <label>
                    Payment method
                    <select name="paymentMethod" value={orderForm.paymentMethod} onChange={handleOrderChange}>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                    </select>
                  </label>
                </div>
                <div className="form-grid">
                  <label>
                    Pickup date
                    <input name="pickupDate" type="date" value={orderForm.pickupDate} onChange={handleOrderChange} />
                  </label>
                  <label>
                    Pickup time
                    <input name="pickupTime" type="time" value={orderForm.pickupTime} onChange={handleOrderChange} />
                  </label>
                </div>
                <label>
                  Special instructions
                  <textarea name="notes" rows="4" value={orderForm.notes} onChange={handleOrderChange} />
                </label>
                <button className="button button-primary submit-button" type="submit">Place Order</button>
              </form>
              {orderMessage ? <div className="confirmation-box"><h3>Order received</h3><p>{orderMessage}</p></div> : null}
            </section>
          </div>
        </section>

        <section className="section-shell" id="reservations">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Reservations</p>
              <h2>Reserve a table for coffee, brunch, meetings, or special catch-ups.</h2>
            </div>
          </div>
          <div className="feature-layout">
            <div className="feature-panel">
              <h3>Reserve your table</h3>
              <form className="order-form" onSubmit={handleReservationSubmit}>
                <div className="form-grid">
                  <label>Guest name<input name="reservationName" required /></label>
                  <label>Phone number<input name="reservationPhone" required /></label>
                </div>
                <div className="form-grid">
                  <label>Date<input name="reservationDate" type="date" required /></label>
                  <label>Time<input name="reservationTime" type="time" required /></label>
                </div>
                <button className="button button-primary submit-button" type="submit">Reserve Table</button>
              </form>
              {reservationMessage ? <div className="confirmation-box"><h3>Reservation request sent</h3><p>{reservationMessage}</p></div> : null}
            </div>
            <div className="feature-panel accent-panel">
              <h3>Why guests choose Cafenity</h3>
              <ul className="experience-list">
                <li>Warm indoor seating with work-friendly tables</li>
                <li>Flexible timing for brunch visits and evening dessert plans</li>
                <li>Convenient ordering when you want food ready on arrival</li>
                <li>A comfortable setting for meetups and celebrations</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section-shell" id="catering">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Catering & bulk orders</p>
              <h2>Fresh coffee, bakes, and cafe favorites for teams, events, and gatherings.</h2>
            </div>
          </div>
          <div className="feature-layout">
            <div className="feature-panel">
              <h3>Request a catering quote</h3>
              <form className="order-form" onSubmit={handleCateringSubmit}>
                <div className="form-grid">
                  <label>Contact name<input name="cateringName" required /></label>
                  <label>Organization<input name="organization" /></label>
                </div>
                <div className="form-grid">
                  <label>Phone number<input name="cateringPhone" required /></label>
                  <label>Email<input name="cateringEmail" type="email" required /></label>
                </div>
                <div className="form-grid">
                  <label>Event date<input name="eventDate" type="date" required /></label>
                  <label>Estimated headcount<input name="headCount" type="number" min="10" required /></label>
                </div>
                <label>
                  What do you need?
                  <textarea name="eventNeeds" rows="4" required />
                </label>
                <button className="button button-primary submit-button" type="submit">Send Catering Request</button>
              </form>
              {cateringMessage ? <div className="confirmation-box"><h3>Request received</h3><p>{cateringMessage}</p></div> : null}
            </div>
            <div className="feature-panel image-panel">
              <img src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80" alt="Cafe catering table" />
              <div className="panel-copy">
                <h3>Popular catering options</h3>
                <p>Breakfast trays, coffee service, brownie boxes, muffin assortments, sandwich platters, and dessert selections.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell" id="contact">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Stay connected</p>
              <h2>Join our guest list and keep up with what is brewing at Cafenity.</h2>
            </div>
          </div>
          <div className="feature-layout">
            <div className="feature-panel accent-panel">
              <h3>Join the Cafenity community</h3>
              <form className="order-form" onSubmit={handleLoyaltySubmit}>
                <div className="form-grid">
                  <label>Name<input name="loyaltyName" required /></label>
                  <label>Email<input name="loyaltyEmail" type="email" required /></label>
                </div>
                <button className="button button-primary submit-button" type="submit">Join Updates</button>
              </form>
              {loyaltyMessage ? <div className="confirmation-box"><h3>Welcome to Cafenity</h3><p>{loyaltyMessage}</p></div> : null}
            </div>
            <div className="feature-panel">
              <h3>Visit Cafenity</h3>
              <div className="customer-grid">
                <div className="info-block"><span className="info-title">Location</span><p>Opposite VIT Vellore, Tamil Nadu</p></div>
                <div className="info-block"><span className="info-title">Hours</span><p>Monday to Sunday<br />9:00 AM to 10:00 PM</p></div>
                <div className="info-block"><span className="info-title">Contact</span><p>+91 93329 05789<br />hello@cafenity.in</p></div>
                <div className="info-block"><span className="info-title">Best for</span><p>Pickup, reservations, meetings, dessert runs, and event orders</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {cartOpen ? (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="panel-header">
              <h3>Your order</h3>
              <button className="text-button" type="button" onClick={() => setCartOpen(false)}>Close</button>
            </div>
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <p className="empty-state">Your cart is empty. Add items from the menu to begin your order.</p>
              ) : (
                cartItems.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-main">
                      <img className="cart-thumb" src={item.image} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{formatCurrency(item.price)} each</p>
                        <div className="cart-item-actions">
                          <div className="qty-control">
                            <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </article>
                ))
              )}
            </div>
            <div className="summary-card">
              <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(summary.subtotal)}</strong></div>
              <div className="summary-row"><span>Taxes and fees</span><strong>{formatCurrency(summary.tax)}</strong></div>
              <div className="summary-row total-row"><span>Total</span><strong>{formatCurrency(summary.total)}</strong></div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

export default App;
