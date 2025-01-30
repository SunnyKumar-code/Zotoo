# Zotoo

Zotoo is a web application hosted on [Vercel](https://zotoo.netlify.app/) that provides user authentication functionality using Firebase.

## Features

- User registration (Sign Up)
- User login (Sign In)
- Firebase Authentication
- Firestore database integration
- Responsive UI
- Chatbot for user assistance
- Community page for discussions

## Technologies Used

- React.js
- Firebase Authentication & Firestore
- React Toastify (for notifications)
- CSS (for styling)
- Vercel (for deployment)

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm or yarn

### Steps to Run Locally

1. Clone the repository:

   ```sh
   git clone https://github.com/SunnyKumar-code/zotoo.git
   cd zotoo
   ```

2. Install dependencies:

   ```sh
   npm install  
   # or
   yarn install
   ```

3. Set up Firebase:

   - Create a Firebase project at Firebase Console
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get Firebase configuration and create a `.env` file in the project root:
     ```env
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Run the application:

   ```sh
   npm start
   ```

   The app will run at `http://localhost:3000/`

## Deployment

To deploy on Vercel:

1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Deploy:
   ```sh
   vercel
   ```

## Live Demo

Check out the live version: [Zotoo](https://zotoo.vercel.app/)

## License

This project is licensed under the MIT License.

## Contact

For any queries, feel free to reach out.

