import { useState } from 'react'
import './index.css'

// Import your components
import Login from './features/auth/Login'
import Superadmin from './features/dashboard/Superadmin'

export default function App() {
  // State to track if user is authenticated
  // false = show Login, true = show Dashboard
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // If user is logged in, show the Dashboard
  if (isAuthenticated) {
    return <Superadmin />;
  }

  // Otherwise, show the Login page
  // We pass the function to change state to true
  return (
    <Login onLogin={() => setIsAuthenticated(true)} />
  );
}