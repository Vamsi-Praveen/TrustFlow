import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import AdminLayout from './pages/Admin/AdminLayout'
import Dashboard from './pages/Admin/Dashboard'
import NotFound from './pages/NotFound'
import Users from './pages/Admin/Users'
import Projects from './pages/Admin/Projects'
import Roles from './pages/Admin/Roles'
import Members from './pages/Admin/Members'
import Configurations from './pages/Admin/Configuration'

const App = () => {
  return (
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
          <Route path='*' element={<NotFound/>}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default App