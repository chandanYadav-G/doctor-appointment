import { useState } from 'react' 
import { Navigate, Route, Routes } from 'react-router-dom' 
import { useSelector } from 'react-redux' 
import TopBar from './components/TopBar' 
import Sidebar from './components/Sidebar' 
import LoginPage from './pages/LoginPage' 
import SignupPage from './pages/SignupPage' 
import DashboardPage from './pages/DashboardPage' 
import BookAppointmentPage from './pages/BookAppointmentPage' 
import ServicesPage from './pages/ServicesPage' 
import MyAppointmentsPage from './pages/MyAppointmentsPage' 

// Redirect unauthenticated users away from private screens.
function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.app.user) 

  if (!user) {
    return <Navigate to='/login' replace /> 
  }

  return children 
}

// Keep authenticated users from revisiting the login/signup pages.
function AuthRoute({ children }) {
  const user = useSelector((state) => state.app.user) 

  if (user) {
    return <Navigate to='/dashboard' replace /> 
  }

  return children 
}

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true) 

  // Shared shell for all authenticated app screens.
  return (
    <div className='min-h-screen w-full bg-[#f3f0f1] font-app'>
      <TopBar onToggleSidebar={() => setSidebarOpen((previous) => !previous)} />
      <div className='flex min-h-[calc(100vh-64px)] bg-[#f1f3f2] max-[900px]:block'>
        <Sidebar isOpen={sidebarOpen} />
        <main className='min-h-full flex-1'>{children}</main>
      </div>
    </div>
  ) 
}

function App() {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />
      <Route
        path='/signup'
        element={
          <AuthRoute>
            <SignupPage />
          </AuthRoute>
        }
      />

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/book-appointment'
        element={
          <ProtectedRoute>
            <AppLayout>
              <BookAppointmentPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/services'
        element={
          <ProtectedRoute>
            <AppLayout>
              <ServicesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/my-appointments'
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyAppointmentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path='/' element={<HomeRedirect />} />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  ) 
}

function HomeRedirect() {
  const user = useSelector((state) => state.app.user) 

  return user ? (
    <Navigate to='/dashboard' replace />
  ) : (
    <Navigate to='/login' replace />
  ) 
}

export default App 
