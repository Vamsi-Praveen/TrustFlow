import { Activity, Clock, FolderKanban, Settings, Shield, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import useAxios from '@/hooks/useAxios'
import { useEffect,useState } from 'react'
import { Badge } from './ui/badge'

const AdminDashboard = () => {
  const mockAdminStats = {
    totalUsers: 1240,
    totalProjects: 58,
    totalIssues: 12,
    issuesCreatedToday: 34,
  }
  const [AdminStats, setAdminStats] = useState(mockAdminStats);

  const mockAdminActivity = [
    {
      id: 1,
      user: 'Vamsi Praveen',
      action: 'Created a new project: "Mobile App Redesign"',
      date: 'Nov 1, 2025',
    },
    {
      id: 2,
      user: 'Admin',
      action: 'Invited a new user: john.doe@example.com',
      date: 'Oct 31, 2025',
    },
    {
      id: 3,
      user: 'Jane Smith',
      action: 'Updated the "Administrator" role permissions',
      date: 'Oct 30, 2025',
    },
    { id: 4, user: 'Alex Johnson', action: 'Closed project "Alpha"', date: 'Oct 29, 2025' },
  ]

  const mockRoleOverview = [
    { name: 'Administrator', count: 2 },
    { name: 'Developer', count: 15 },
    { name: 'Tester / QA', count: 8 },
    { name: 'Reporter', count: 32 },
  ]

  const [AdminActivity, setAdminActivity] = useState(mockAdminActivity);

  const [RoleOverview, setRoleOverview] = useState(mockRoleOverview);
  
  const API = useAxios();

  useEffect(() => {
    getDashboardStats();
    getAdminActivity();
    getRoleOverview();
  }, []);

  async function getDashboardStats() {
    try {
      const response = await API.get('/DashBoard/GetDashboardStats')
      setAdminStats(response.data.result);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }
  }

  async function getAdminActivity() {
    try {
      const response = await API.get('DashBoard/GetRecentActivityList')
      setAdminActivity(response.data.result);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }
  }
  
  async function getRoleOverview() {
    try {
      const response = await API.get('/DashBoard/GetRoleOverview')
      setRoleOverview(response.data.result);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{AdminStats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{AdminStats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{AdminStats.totalIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issues Created Today</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{AdminStats.issuesCreatedToday}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Global Activity Feed</CardTitle>
            <CardDescription>Recent important events across the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AdminActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-gray-500">{activity.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" /> Manage Users
                </Button>
              </Link>
              <Link to="/roles">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" /> Manage Roles
                </Button>
              </Link>
              <Link to="/configurations">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" /> System Configurations
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Role Overview</CardTitle>
              <CardDescription>Distribution of users across roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {RoleOverview.map((role) => (
                <div key={role.name} className="flex items-center justify-between">
                  <div className="text-sm font-medium">{role.name}</div>
                  <Badge variant="secondary">{role.count} Users</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
