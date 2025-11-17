import AdminDashboard from '@/components/AdminDashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import UserDashboard from '@/components/UserDashboard'
import { useAuth } from '@/context/AuthContext'
import useAxios from '@/hooks/useAxios'
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
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

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




const Dashboard = () => {
  const { user } = useAuth() || { user: { firstName: 'Default', lastName: 'User', roles: [] } }; 
  
  const isAdmin = user && user.role.includes('Administrator');

  const API = useAxios();

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
