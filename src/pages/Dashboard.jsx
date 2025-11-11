import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context/AuthContext'
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
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// --- MOCK DATA ---
const mockAdminStats = {
  totalUsers: 1240,
  totalProjects: 58,
  activeSessions: 12,
  issuesCreatedToday: 34,
};

const mockUserStats = {
  myOpenIssues: 8,
  myProjects: 5,
  resolvedByMe: 23,
  overdueIssues: 2,
};

const mockAdminActivity = [
  { id: 1, user: 'Vamsi Praveen', action: 'Created a new project: "Mobile App Redesign"', date: 'Nov 1, 2025' },
  { id: 2, user: 'Admin', action: 'Invited a new user: john.doe@example.com', date: 'Oct 31, 2025' },
  { id: 3, user: 'Jane Smith', action: 'Updated the "Administrator" role permissions', date: 'Oct 30, 2025' },
  { id: 4, user: 'Alex Johnson', action: 'Closed project "Alpha"', date: 'Oct 29, 2025' },
];

const mockUserActivity = [
    { id: 1, user: 'Vamsi Praveen', action: 'commented on', issue: 'BUG-8782', date: '5m ago' },
    { id: 2, user: 'Jane Smith', action: 'assigned you to', issue: 'FEAT-1123', date: '1h ago' },
    { id: 3, user: 'You', action: 'changed status to In Progress on', issue: 'BUG-8779', date: '3h ago' },
];

const mockMyOpenIssues = [
    { id: 'BUG-8782', title: 'Button component overflows on mobile view', project: 'E-Commerce Platform', priority: 'High' },
    { id: 'FEAT-1123', title: 'Implement dark mode toggle', project: 'E-Commerce Platform', priority: 'Low' },
    { id: 'TASK-5001', title: 'Set up CI/CD pipeline for deployment', project: 'Mobile App', priority: 'High' },
];

const mockRoleOverview = [
    { name: 'Administrator', count: 2 },
    { name: 'Developer', count: 15 },
    { name: 'Tester / QA', count: 8 },
    { name: 'Reporter', count: 32 },
];

const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'critical': return 'destructive';
        case 'high': return 'destructive';
        case 'medium': return 'secondary';
        case 'low': return 'outline';
        default: return 'default';
    }
}
// --- END MOCK DATA ---

const AdminDashboard = () => (
  <div className="space-y-6">
    {/* Top Stat Cards */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockAdminStats.totalUsers}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Projects</CardTitle><FolderKanban className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockAdminStats.totalProjects}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Sessions</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockAdminStats.activeSessions}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Issues Created Today</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockAdminStats.issuesCreatedToday}</div></CardContent></Card>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Global Activity Feed</CardTitle><CardDescription>Recent important events across the system.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>{mockAdminActivity.map((activity) => (<TableRow key={activity.id}><TableCell className="font-medium">{activity.user}</TableCell><TableCell>{activity.action}</TableCell><TableCell className="text-gray-500">{activity.date}</TableCell></TableRow>))}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Admin Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Link to="/users"><Button variant="outline" className="w-full justify-start"><Users className="mr-2 h-4 w-4"/> Manage Users</Button></Link>
            <Link to="/roles"><Button variant="outline" className="w-full justify-start"><Shield className="mr-2 h-4 w-4"/> Manage Roles</Button></Link>
            <Link to="/configurations"><Button variant="outline" className="w-full justify-start"><Settings className="mr-2 h-4 w-4"/> System Configurations</Button></Link>
          </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Role Overview</CardTitle><CardDescription>Distribution of users across roles.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                {mockRoleOverview.map(role => (
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
);


const UserDashboard = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">My Open Issues</CardTitle><Bug className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockUserStats.myOpenIssues}</div><p className="text-xs text-muted-foreground">{mockUserStats.overdueIssues} are overdue</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">My Projects</CardTitle><FolderKanban className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockUserStats.myProjects}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Issues Resolved by Me</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockUserStats.resolvedByMe}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">My Recent Activity</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockUserActivity.length}</div><p className="text-xs text-muted-foreground">events in the last 24 hours</p></CardContent></Card>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader><CardTitle>My Open Issues</CardTitle><CardDescription>A list of issues currently assigned to you.</CardDescription></CardHeader>
                <CardContent>
                    <Table><TableHeader><TableRow><TableHead>Issue</TableHead><TableHead>Project</TableHead><TableHead>Priority</TableHead></TableRow></TableHeader><TableBody>{mockMyOpenIssues.map((issue) => (<TableRow key={issue.id}><TableCell><div className="font-medium">{issue.id}</div><div className="text-sm text-muted-foreground">{issue.title}</div></TableCell><TableCell>{issue.project}</TableCell><TableCell><Badge variant={getPriorityBadgeVariant(issue.priority)}>{issue.priority}</Badge></TableCell></TableRow>))}</TableBody></Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>My Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                {mockUserActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                        <Activity className="h-4 w-4 mt-1 text-muted-foreground"/>
                        <div className="text-sm">
                            <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.issue}</span>
                            <div className="text-xs text-muted-foreground mt-1">{activity.date}</div>
                        </div>
                    </div>
                 ))}
                </CardContent>
             </Card>
        </div>
    </div>
);


const Dashboard = () => {
  // Use a fallback for development if AuthContext is not yet fully wired
  const { user } = useAuth() || { user: { firstName: 'Default', lastName: 'User', roles: [] } }; 

  // Safely check if the user exists and has the 'Administrator' role
  const isAdmin = user && user.role.includes('Administrator');

  return (
    <div className="flex-1 space-y-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'Guest'} 👋
        </h1>
        <p className="text-sm text-gray-500">
            {isAdmin 
                ? 'Here is the system-wide overview of TrustFlow.'
                : 'Check what’s happening with your projects and issues today.'
            }
        </p>
      </div>

      <Separator className="my-4" />
      
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  )
}

export default Dashboard
