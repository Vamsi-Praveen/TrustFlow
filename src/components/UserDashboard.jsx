import {
  Activity,
  Bug,
  CheckCircle,
  Clock,
  FolderKanban,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'

const UserDashboard = () => {
  const mockUserStats = {
    myOpenIssues: 8,
    myProjects: 5,
    resolvedByMe: 23,
    recentActivity: 2,
  }

  const [UserStats, setUserStats] = useState(mockUserStats);

  const mockUserActivity = [
    { id: 1, user: 'Vamsi Praveen', action: 'commented on', issue: 'BUG-8782', date: '5m ago' },
    { id: 2, user: 'Jane Smith', action: 'assigned you to', issue: 'FEAT-1123', date: '1h ago' },
    {
      id: 3,
      user: 'You',
      action: 'changed status to In Progress on',
      issue: 'BUG-8779',
      date: '3h ago',
    },
  ]

  const mockMyOpenIssues = [
    {
      id: 'BUG-8782',
      title: 'Button component overflows on mobile view',
      project: 'E-Commerce Platform',
      priority: 'High',
    },
    {
      id: 'FEAT-1123',
      title: 'Implement dark mode toggle',
      project: 'E-Commerce Platform',
      priority: 'Low',
    },
    {
      id: 'TASK-5001',
      title: 'Set up CI/CD pipeline for deployment',
      project: 'Mobile App',
      priority: 'High',
    },
  ]

  const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'default'
    }
  }
  const [MyOpenIssues, setMyOpenIssues] = useState(mockMyOpenIssues);

  const [userActivity, setUserActivity] = useState(mockUserActivity);


  const API = useAxios();

  useEffect(() => {
    getDashboardStats();
    getMyOpenIssues();
    getMyActivity();
  }, []);

  async function getDashboardStats() {
    try {
      const response = await API.get('/DashBoard/GetUserDashBoardStats')
      setUserStats(response.data.result);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }
  }

  async function getMyOpenIssues() {
    try {
      const response = await API.get('/DashBoard/GetUserOpenIssueList')
      setMyOpenIssues(response.data.result);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }
  }

  async function getMyActivity() {
    try {
      const response = await API.get('/DashBoard/GetUserRecentActivityList')
      setUserActivity(response.data.result);

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
            <CardTitle className="text-sm font-medium">My Open Issues</CardTitle>
            <Bug className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{UserStats.myOpenIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Projects</CardTitle>
            <FolderKanban className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{UserStats.myProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issues Resolved by Me</CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{UserStats.resolvedByMe}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Recent Activity</CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{UserStats.recentActivity}</div>
            <p className="text-muted-foreground text-xs">events in the last 24 hours</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Open Issues</CardTitle>
            <CardDescription>A list of issues currently assigned to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MyOpenIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div className="font-medium">{issue.id}</div>
                      <div className="text-muted-foreground text-sm">{issue.title}</div>
                    </TableCell>
                    <TableCell>{issue.project}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                        {issue.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Activity className="text-muted-foreground mt-1 h-4 w-4" />
                <div className="text-sm">
                  <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                  <span className="font-semibold">{activity.issue}</span>
                  <div className="text-muted-foreground mt-1 text-xs">{activity.date}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserDashboard
