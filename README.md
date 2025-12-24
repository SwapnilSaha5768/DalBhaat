
<div align="center">

  <h1>🍛 DalBhaat</h1>
  
  <h3><i>"Everyday Essentials, Delivered."</i></h3>

  <p>
    An all-in-one eCommerce platform for your daily grocery needs. Fresh vegetables, quality staples, and more—delivered straight to your doorstep.
  </p>

  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#contributors">Contributors</a>
  </p>

  ![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
  ![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)
  ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

</div>

<br />

## 📖 Overview

**DalBhaat** (literally "Lentils and Rice") is a full-stack eCommerce application designed to simplify the grocery shopping experience. Built with the **MERN** stack and styled with **Tailwind CSS**, it offers a seamless, responsive, and secure platform for users to browse, search, and purchase essential goods. With a dedicated Admin Panel, inventory management is as easy as the shopping itself.

---

## ✨ Key Features

### 🛍️ User Experience
-   **Dynamic Product Catalog**: Browse products by categories (Vegetables, Fruits, Spices, etc.) with real-time stock updates.
-   **Smart Search & Filtering**: Find exactly what you need with instant name search, category filters, and price sorting.
-   **Secure Authentication**: Robust Sign Up & Login system powered by **JWT**.
-   **User Dashboard**: Manage profile details, multiple shipping addresses, and view order history.
-   **Wishlist & Cart**: Save items for later or add them to your cart for a quick checkout.
-   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.

### 💳 Checkout & Payments
-   **Flexible Checkout**: Choose between **Cash on Delivery** or mobile payments via **bKash**.
-   **Coupon System**: Apply discount codes during checkout for extra savings.
-   **Delivery Options**: Choose *Standard* or *Express* delivery based on your urgency.

### 🛡️ Admin Power
-   **Protected Admin Panel**: Secure route for administrators.
-   **Order Management**: View and update order statuses (Processing, Delivered, Cancelled).
-   **Inventory Control**: Add, edit, or remove products with ease.

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![JWT](https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
-   Node.js (v14 or higher)
-   MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/dalbhaat.git
    cd dalbhaat
    ```

2.  **Install Dependencies**
    We use `concurrently` to run both servers easily. Install dependencies for root, backend, and frontend.
    ```bash
    npm run install-all
    ```

3.  **Environment Setup**
    Create a `.env` file in the `backend/` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    *Optionally, configure frontend environment variables if needed.*

4.  **Run the Application**
    Start both the backend and frontend servers with a single command:
    ```bash
    npm run dev
    ```

    -   **Frontend**: http://localhost:3000
    -   **Backend**: http://localhost:5000

---

## 🤝 Contributors

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />
<div align="center">
  <p>Made with ❤️ by the Swapnil Saha</p>
</div>
