import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Book from './pages/Book'
import Calendar from './pages/Calendar'
import BookingsList from './pages/BookingsList'
import Settings from './pages/Settings'
import GoogleOAuthCallback from './pages/admin/GoogleOAuthCallback'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public guest booking route, e.g. bridgewaybooking.com/wellness-co */}
          <Route path="/:slug" element={<Book />} />

          {/* Root redirect to admin panel */}
          <Route path="/" element={<Navigate to="/admin/calendar" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Google OAuth callback — must be public (Google redirects here without auth) */}
          <Route path="/admin/oauth/google" element={<GoogleOAuthCallback />} />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/admin/calendar" element={<Calendar />} />
              <Route path="/admin/bookings" element={<BookingsList />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/admin/calendar" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
