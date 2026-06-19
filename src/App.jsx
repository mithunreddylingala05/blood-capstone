import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

import SplashPage from './pages/SplashPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UserRegisterPage from './pages/auth/UserRegisterPage'
import HospitalRegisterPage from './pages/auth/HospitalRegisterPage'

import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ContactModal from './components/ui/ContactModal'

import HomePage from './pages/home/HomePage'
import BloodSearchPage from './pages/search/BloodSearchPage'
import EmergencyRequestPage from './pages/requests/EmergencyRequestPage'
import MyRequestsPage from './pages/requests/MyRequestsPage'
import MyDonationsPage from './pages/requests/MyDonationsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import ProfilePage from './pages/profile/ProfilePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import StateDirectoryPage from './pages/stats/StateDirectoryPage'
import LandingPage from './pages/landing/LandingPage'

export default function App() {
  const { init, loading, user } = useAuthStore()

  useEffect(() => { init() }, [])

  if (loading) return <SplashPage />

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: 'Outfit, sans-serif', fontWeight: 600, borderRadius: '16px', fontSize: '14px' },
          success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
          error: { iconTheme: { primary: '#D32F2F', secondary: '#fff' } },
        }}
      />
      <ContactModal />
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/register/hospital" element={<HospitalRegisterPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<BloodSearchPage />} />
            <Route path="/emergency" element={<EmergencyRequestPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-requests" element={<MyRequestsPage />} />
            <Route path="/my-donations" element={<MyDonationsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/state-directory" element={<StateDirectoryPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
