<!-- @format -->

# DolaShop E-Commerce Platform

## Live Demo

[Visit DolaShop Live](https://mahmoudadel810.github.io/Ecommerce-JavaScript/index.html)

## Project Overview

DolaShop is a modern e-commerce web application built with vanilla JavaScript (ES6+), HTML5, and CSS3. The project demonstrates core e-commerce functionality with clean code organization and responsive design.

![Screenshot 2025-05-15 at 3 59 32 PM](https://github.com/user-attachments/assets/3094be1a-1f81-42d5-a696-82d90b9f9b95)

## Key Features

- **Product Browsing**: Filter by categories (Electronics, Mobiles, Appliances)
- **User Authentication**: Registration and login with secure password validation
- **Shopping Cart**: Add/remove items, adjust quantities, real-time price calculation
- **Wishlist System**: Save products for later and easily move to cart
- **Product Search**: Find products quickly with dynamic search functionality
- **Responsive Design**: Optimized for all screen sizes
- **API Integration**: Products loaded from a RESTful API hosted on Vercel

## Technology Stack

- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- RESTful API (Express.js backend)
- LocalStorage for session management
- GitHub Pages for frontend hosting
- Vercel for API deployment

## Project Structure

```
├── public/         # Static files for deployment
│   ├── index.html  # Main entry point
│   ├── css/        # Styling files
│   ├── JS/         # JavaScript modules
│   └── img/        # Images and assets
├── server/         # Backend API
│   ├── index.js    # Express server
│   └── products.json # Product database
└── vercel.json     # Vercel deployment configuration
```

## API Endpoints

- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Get a specific product
- `GET /api/categories` - List all product categories
- `GET /api/search?q=term` - Search products

## Quick Start

1. Clone the repository
2. Open `public/index.html` in your browser to view the frontend
3. Browse the shop, create an account, and start shopping!

## Development

To run the project locally with the API:

1. Install dependencies: `npm install`
2. Start the server: `node server/index.js`
3. The API will be available at `http://localhost:3000`

## Future Development

- Enhanced user profiles with order history
- Payment gateway integration
- Admin dashboard for inventory management
- Product reviews and ratings
- Wishlist sharing functionality

## Contributing

Contributions, issues, and feature requests are welcome!

## License

This project is available for educational purposes.
