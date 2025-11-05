import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'
import AdminLayout from './pages/Admin/AdminLayout'
import Configurations from './pages/Admin/Configuration'
import Dashboard from './pages/Admin/Dashboard'
import Members from './pages/Admin/Members'
import Projects from './pages/Admin/Projects'
import Roles from './pages/Admin/Roles'
import Users from './pages/Admin/Users'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/auth/login' element={<Login />} />
            <Route path='/admin' element={<AdminLayout />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='users' element={<Users />} />
              <Route path='projects' element={<Projects />} />
              <Route path='roles' element={<Roles />} />
              <Route path='members' element={<Members />} />
              <Route path='configuration' element={<Configurations />} />
            </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App