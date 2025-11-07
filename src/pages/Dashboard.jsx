import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext"
import { Activity, Clock, FolderGit2, Users } from "lucide-react"

const Dashboard = () => {

  const {user} = useAuth();

  const stats = [
    { title: "Total Users", value: "1,240", icon: <Users className="w-5 h-5 text-blue-500" /> },
    { title: "Projects", value: "58", icon: <FolderGit2 className="w-5 h-5 text-green-500" /> },
    { title: "Active Sessions", value: "12", icon: <Activity className="w-5 h-5 text-orange-500" /> },
    { title: "Pending Tasks", value: "34", icon: <Clock className="w-5 h-5 text-purple-500" /> },
  ]

  const recentActivity = [
    { id: 1, user: "Vamsi Praveen", action: "Created a new project", date: "Nov 1, 2025" },
    { id: 2, user: "John Doe", action: "Added a new member", date: "Oct 31, 2025" },
    { id: 3, user: "Jane Smith", action: "Updated user permissions", date: "Oct 30, 2025" },
    { id: 4, user: "Alex Johnson", action: "Closed project Alpha", date: "Oct 29, 2025" },
  ]

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Welcome back, {user.firstName +" "+ user.lastName} 👋</h1>
        <p className="text-sm text-gray-500">Check what’s happening in TrustFlow today.</p>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <Card className="rounded-md border p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="text-right text-gray-500">{activity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
