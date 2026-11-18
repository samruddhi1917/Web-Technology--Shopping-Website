# ShopEase — Smart Shopping Website Portal

A responsive front-end shopping website mini project made with **HTML, CSS and JavaScript**.

## Features

- Single Page Application (SPA) navigation using JavaScript hash routing (`#/home`, `#/shop`, `#/cart`, `#/checkout`) without full page reload.
- Responsive header, navigation, product listing and footer.
- Product information loaded dynamically from `products.json` using `fetch()`.
- Product search, category filter and price sorting.
- Add to cart, change quantity and remove products.
- Cart saved in browser `localStorage`, so it remains after refreshing the page.
- Checkout form with browser validation plus custom phone number and PIN code checks.
- Demo order confirmation (no real payment or backend order processing).

## Folder structure

```text
Smart_Shopping_Website/
├── index.html
├── style.css
├── app.js
├── products.json
└── README.md
```

## How to open in VS Code

1. Extract `Smart_Shopping_Website.zip`.
2. Open VS Code.
3. Select **File → Open Folder** and choose the extracted `Smart_Shopping_Website` folder.
4. Install the **Live Server** extension if it is not already installed.
5. Right-click `index.html` and choose **Open with Live Server**.
6. Your browser will open the website.

**Important:** Run using Live Server (or another local HTTP server). The app uses `fetch("products.json")`, which normally does not work when `index.html` is opened directly using a `file://` URL.

## Main JavaScript concepts to understand for viva

- **SPA routing:** `renderRoute()` reads the URL hash and displays the correct view. The `hashchange` event updates the view when navigation changes.
- **JSON / fetch:** `loadProducts()` fetches `products.json` and converts the response into JavaScript data using `response.json()`.
- **DOM manipulation:** Functions such as `renderShop()`, `renderCart()` and `renderCheckout()` update the `#app` element.
- **localStorage:** `saveCart()` stores the cart as JSON text. The cart is restored when the app starts.
- **Validation:** The checkout form uses required fields, email validation, and custom regular expressions for a 10-digit mobile number and 6-digit PIN code.

## Testing checklist

- [ ] Open Home, Shop, Cart and Checkout using the navigation.
- [ ] Confirm that navigation does not reload the whole page.
- [ ] Search for a product and change the category filter.
- [ ] Add products, change quantity and remove an item.
- [ ] Refresh the browser and confirm the cart is still saved.
- [ ] Try submitting checkout with empty/invalid values.
- [ ] Resize the browser to check the responsive layout.

## Customization

Edit `products.json` to add or change products. Each product has `id`, `name`, `category`, `price`, `emoji`, `color`, `tag` and `description`.

## Project scope

This is an educational front-end mini project. It does not include a backend, user login, real payment gateway, inventory management or actual delivery.
