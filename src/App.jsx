import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RedirectRoute from './components/RedirectRoute'
import { Toaster } from './components/ui/sonner'
import AuthProvider from './context/AuthContext'
import Users from './pages//Users'
import Configurations from './pages/Configuration'
import ConfigurePassword from './pages/ConfigurePassword'
import Dashboard from './pages/Dashboard'
import Issues from './pages/Issues'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Members from './pages/Members'
import NotFound from './pages/NotFound'
import PasswordReset from './pages/PasswordReset'
import ProjectDetails from './pages/ProjectDetails'
import Projects from './pages/Projects'
import Reports from './pages/Reports'
import Roles from './pages/Roles'
import Settings from './pages/Settings'
import MyIssues from './pages/MyIssues'
import IssueDetails from './pages/IssueDetails'

const App = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <RedirectRoute>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/auth/configurepassword" element={<ConfigurePassword />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projectdetails/:projectId" element={<ProjectDetails />} />
                  <Route path="roles" element={<Roles />} />
                  <Route path="members" element={<Members />} />
                  <Route path="configuration" element={<Configurations />} />
                  <Route path="issues" element={<Issues />} />
                  <Route path="myissues" element={<MyIssues />} />
                  <Route path="issue" element={<IssueDetails />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="reports" element={<Reports />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
              <Route path="/auth/resetpassword/:token" element={<PasswordReset />} />
            </Routes>
          </RedirectRoute>
        </BrowserRouter>
      </AuthProvider>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
