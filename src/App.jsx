import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from './components/ui/sonner'
import AuthProvider from './context/AuthContext'
import Users from './pages//Users'
import Configurations from './pages/Configuration'
import Dashboard from './pages/Dashboard'
import Issues from './pages/Issues'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Members from './pages/Members'
import NotFound from './pages/NotFound'
import Projects from './pages/Projects'
import Roles from './pages/Roles'
import Settings from './pages/Settings'
import ProjectDetails from './pages/ProjectDetails'

const App = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projectdetails/:projectId" element={<ProjectDetails />} />
                <Route path="roles" element={<Roles />} />
                <Route path="members" element={<Members />} />
                <Route path="configuration" element={<Configurations />} />
                <Route path="issues" element={<Issues />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
