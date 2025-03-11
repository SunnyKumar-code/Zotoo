# Food Delivery App

A modern, responsive food delivery web application built with React and Firebase. This app allows users to browse food items, add them to cart, place orders, and interact with a helpful chatbot assistant powered by Google's Gemini API.

## 🍔 Features

- **User Authentication**

  - Sign up and login functionality
  - User profile management
  - Secure authentication with Firebase

- **Food Ordering System**

  - Browse food items by category
  - Add items to cart
  - Adjust quantities
  - Place orders

- **Interactive UI**

  - Responsive design for all devices
  - Dark/Light mode toggle
  - Smooth animations and transitions

- **Chatbot Assistant**

  - AI-powered food assistant using Google's Gemini API
  - Intelligent responses to queries about menu, delivery, and payment options
  - Fallback to rule-based responses when offline
  - Real-time conversation interface

- **Community Page**
  - Share food experiences
  - Interact with other users
  - Food-related discussions

## 🛠️ Technologies Used

- **Frontend**

  - React.js (with Hooks and Context API)
  - React Router for navigation
  - CSS for styling
  - React Icons for UI elements
  - React Toastify for notifications

- **Backend**

  - Firebase Authentication
  - Firestore Database
  - Firebase Functions

- **AI Integration**

  - Google's Gemini API for intelligent chatbot responses

- **Build Tools**
  - Vite for fast development and building
  - ESLint for code quality

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps to Run Locally

1. Clone the repository:

   ```sh
   git clone https://github.com/SunnyKumar-code/food-delivery-app.git
   cd food-delivery-app
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Replace the Firebase configuration in `src/components/Firebase/firebase.js` with your own

4. Set up Gemini API:

   - Get an API key from [Google AI Studio](https://makersuite.google.com/)
   - Create a `.env` file in the project root with the following content:
     ```
     VITE_API_URL=https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY
     ```
   - Replace `YOUR_API_KEY` with your actual Gemini API key

5. Run the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
food-delivery-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AppDownload/
│   │   ├── ExplorMenu/
│   │   ├── Firebase/
│   │   ├── FoodDisplay/
│   │   ├── FoodItem/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── LoginPopUp/
│   │   ├── Navbar/
│   │   └── UserDropdown/
│   ├── context/
│   │   ├── StoreContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   ├── Pages/
│   │   ├── Cart/
│   │   ├── chatBot/
│   │   ├── Community/
│   │   ├── Home/
│   │   └── PlaceOrder/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .eslintrc.json
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🌐 Deployment

The app is deployed on Vercel. You can view the live version at [Live Demo](https://zotoo-d9a4znqt3-sunnykumar-codes-projects.vercel.app/)

To deploy your own version:

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
3. Deploy:
   ```sh
   vercel
   ```

## 🧩 Future Enhancements

- Payment gateway integration
- Order tracking system
- User reviews and ratings
- Personalized recommendations
- Admin dashboard for restaurant owners

## 👨‍💻 Contributors

- [Sunny Kuamr](https://github.com/SunnyKumar-code)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
