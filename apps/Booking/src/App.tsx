import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Book from './pages/Book'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public guest booking route, e.g. bridgewaybooking.com/wellness-co */}
          <Route path="/:slug" element={<Book />} />

          {/* Root redirect to public site if no slug */}
          <Route path="/" element={<Navigate to="/wellness-co" replace />} />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
