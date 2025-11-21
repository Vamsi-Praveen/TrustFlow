import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAxios from '@/hooks/useAxios'
import {
  Activity,
  BarChart2,
  Bug,
  CheckCircle,
  Clock,
  LayoutGrid,
  ListTodo,
  Loader,
  MoreHorizontal,
  MoreVertical,
  PlusCircle,
  Search,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

// --- MOCK DATA ---
const mockUsers = [
  { id: 'usr_1', name: 'Liam Johnson', email: 'liam@example.com', initial: 'LJ', issues: 5 },
  { id: 'usr_2', name: 'Olivia Smith', email: 'olivia@example.com', initial: 'OS', issues: 3 },
  { id: 'usr_3', name: 'Noah Williams', email: 'noah@example.com', initial: 'NW', issues: 8 },
  { id: 'usr_4', name: 'Emma Brown', email: 'emma@example.com', initial: 'EB', issues: 2 },
]

const mockProject = {
  id: 'proj_1',
  name: 'E-Commerce Platform',
  lead: mockUsers[1],
  members: mockUsers,
}

const mockIssues = [
  {
    id: 'BUG-8782',
    title: 'Button component overflows on mobile view',
    status: 'In Progress',
    priority: 'High',
    assignee: mockUsers[0],
    lastUpdated: '2 hours ago',
  },
  {
    id: 'TASK-4321',
    title: 'Update user authentication flow',
    status: 'Backlog',
    priority: 'Medium',
    assignee: mockUsers[1],
    lastUpdated: '1 day ago',
  },
  {
    id: 'BUG-8780',
    title: 'API returns 500 error on invalid date',
    status: 'Done',
    priority: 'High',
    assignee: mockUsers[2],
    lastUpdated: '1 day ago',
  },
  {
    id: 'FEAT-1123',
    title: 'Implement dark mode toggle',
    status: 'To Do',
    priority: 'Low',
    assignee: mockUsers[3],
    lastUpdated: '2 days ago',
  },
  {
    id: 'BUG-8779',
    title: 'Incorrect tax calculation for orders',
    status: 'In Progress',
    priority: 'Critical',
    assignee: mockUsers[0],
    lastUpdated: '3 days ago',
  },
  {
    id: 'TASK-5001',
    title: 'Set up CI/CD pipeline for deployment',
    status: 'To Do',
    priority: 'High',
    assignee: null,
    lastUpdated: '4 days ago',
  },
  {
    id: 'DOCS-0012',
    title: 'Write documentation for the new API endpoints',
    status: 'To Do',
    priority: 'Medium',
    assignee: mockUsers[2],
    lastUpdated: '5 days ago',
  },
]

const mockActivities = [
  { user: mockUsers[0], action: 'commented on', issueId: 'BUG-8782', time: '5m ago' },
  { user: mockUsers[2], action: 'changed status to Done on', issueId: 'BUG-8780', time: '15m ago' },
  { user: mockUsers[3], action: 'created a new issue', issueId: 'FEAT-1123', time: '1h ago' },
  { user: mockUsers[1], action: 'added a new member', target: 'Emma Brown', time: '3h ago' },
]
// --- END MOCK DATA ---

// Helper function
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

const IssueCard = ({ issue }) => (
  <Card className="mb-4 cursor-grab active:cursor-grabbing">
    <CardContent className="p-4">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-sm leading-tight font-semibold">{issue.title}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityBadgeVariant(issue.priority)}>{issue.priority}</Badge>
          <span className="text-foreground font-medium">{issue.id}</span>
        </div>
        <Avatar className="h-6 w-6">
          <AvatarImage src={`/avatars/${issue.assignee?.id}.png`} />
          <AvatarFallback className="text-xs">{issue.assignee?.initial || '?'}</AvatarFallback>
        </Avatar>
      </div>
    </CardContent>
  </Card>
)

const ProjectDetails = () => {
  const [issueSearchTerm, setIssueSearchTerm] = useState('')

  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const [adding, setAdding] = useState(false)

  const [project, setProject] = useState(null)

  const [users, setUsers] = useState([])

  const [open, setOpen] = useState(false)

  const [projectMember, setProjectMember] = useState({
    userId: '',
    roleId: '',
    roleName: '',
    userName: '',
    userEmail: '',
  })

  const [deleteMember, setDeleteMember] = useState(null)

  const API = useAxios()

  const totalIssues = mockIssues.length
  const doneIssues = mockIssues.filter((i) => i.status === 'Done').length
  const progress = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0
  const openIssues = totalIssues - doneIssues
  const issuesByType = useMemo(
    () =>
      mockIssues.reduce((acc, issue) => {
        const type = issue.id.split('-')[0]
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {}),
    [mockIssues],
  )

  const filteredIssues = useMemo(
    () =>
      mockIssues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(issueSearchTerm.toLowerCase()) ||
          issue.id.toLowerCase().includes(issueSearchTerm.toLowerCase()),
      ),
    [issueSearchTerm, mockIssues],
  )

  const boardColumns = useMemo(
    () => [
      { id: 'todo', title: 'To Do', issues: mockIssues.filter((i) => i.status === 'To Do') },
      {
        id: 'inprogress',
        title: 'In Progress',
        issues: mockIssues.filter((i) => i.status === 'In Progress'),
      },
      { id: 'done', title: 'Done', issues: mockIssues.filter((i) => i.status === 'Done') },
    ],
    [mockIssues],
  )

  const { projectId } = useParams()

  const fetchProjectDetails = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/projects/${projectId}`)
      console.log(res)
      if (res?.data?.success && res?.data?.data) {
        setProject(res?.data?.data)
      }
    } catch (error) {
      console.log(ex)
      toast.error('Failed to fetch project details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectDetails()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users')
      if (res.data?.success && res.data?.data) {
        setUsers(res.data.data)
      }
    } catch (ex) {
      console.log(ex)
      toast.error('Failed to get users')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [open])

  const handleMemberAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await API.post(`/projects/${projectId}/members`, projectMember)
      toast.success(`${projectMember.userName} is added to project ${project.name}`)
      fetchProjectDetails()
    } catch (error) {
      console.log(error)
      toast.error('Unable to add user to project')
    } finally {
      setOpen(false)
      setAdding(false)
    }
  }

  const handleMemberDelete = async (e) => {
    if (!deleteMember) return
    try {
      await API.delete(`/projects/${projectId}/members/${deleteMember.userId}`)
      toast.success(`User ${deleteMember.userName} deleted successfully`)
      fetchProjectDetails()
    } catch (error) {
      toast.error(`Failed to delete user ${deleteMember.userName}`)
    } finally {
      setDeleteMember(null)
    }
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project?.name}</h1>
          <div className="text-muted-foreground flex items-center gap-2 pt-1 text-sm">
            Led by{' '}
            <Avatar className="h-6 w-6 border object-contain">
              <AvatarImage
                src={project?.leadProfilePicUrl}
                className="object-cover"
                alt="Profile"
              />
              <AvatarFallback>{project?.leadUserName?.split('')[0]}</AvatarFallback>
            </Avatar>{' '}
            {project?.leadUserName}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {mockProject.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="border-background h-8 w-8 border-2">
                <AvatarImage src={`/avatars/${member.id}.png`} className="object-cover" />
                <AvatarFallback>{member.initial}</AvatarFallback>
              </Avatar>
            ))}
            {mockProject.members.length > 4 && (
              <Avatar className="border-background h-8 w-8 border-2">
                <AvatarFallback>+{mockProject.members.length - 4}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Issue
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart2 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="board">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Board
          </TabsTrigger>
          <TabsTrigger value="issues">
            <ListTodo className="mr-2 h-4 w-4" />
            All Issues
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                <ListTodo className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIssues}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                <Clock className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openIssues}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bugs</CardTitle>
                <Bug className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{issuesByType['BUG'] || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
                <CheckCircle className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress}%</div>
                <Progress value={progress} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIssues.slice(0, 5).map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <div className="font-medium">{issue.id}</div>
                          <div className="text-muted-foreground text-sm">{issue.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{issue.status}</Badge>
                        </TableCell>
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
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Team Workload</CardTitle>
                <CardDescription>Open issues assigned to each team member.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProject.members.map((member) => (
                    <div key={member.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/avatars/${member.id}.png`} className="object-cover" />
                        <AvatarFallback>{member.initial}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm leading-none font-medium">{member.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {member.id === mockProject.lead.id && 'Lead'}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{member.issues} issues</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="board" className="p-0">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            {boardColumns.map((column) => (
              <div key={column.id} className="bg-background rounded-lg">
                <div className="border-b p-4">
                  <h3 className="text-lg font-semibold">
                    {column.title}{' '}
                    <Badge variant="secondary" className="ml-2">
                      {column.issues.length}
                    </Badge>
                  </h3>
                </div>
                <div className="h-[60vh] overflow-y-auto p-4">
                  {column.issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>All Issues</CardTitle>
              <CardDescription>
                Search, filter, and manage all issues for this project.
              </CardDescription>
              <div className="relative mt-2">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  placeholder="Search by ID or title..."
                  className="w-full pl-8"
                  value={issueSearchTerm}
                  onChange={(e) => setIssueSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div className="font-medium">{issue.id}</div>
                        <div className="text-muted-foreground text-sm">{issue.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{issue.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {issue.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/avatars/${issue.assignee.id}.png`}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-xs">
                                {issue.assignee.initial}
                              </AvatarFallback>
                            </Avatar>
                            <span>{issue.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>{issue.lastUpdated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-muted-foreground text-xs">
                Showing <strong>1-{filteredIssues.length}</strong> of{' '}
                <strong>{filteredIssues.length}</strong> issues
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Members</CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleMemberAdd}>
                    <DialogHeader>
                      <DialogTitle>Add Member to Project</DialogTitle>
                      <DialogDescription>
                        Select a user to add them to this project.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                      <Label>User</Label>
                      <Select
                        onValueChange={(value) => {
                          const user = users?.find((u) => u.id == value)
                          setProjectMember((prev) => ({
                            ...prev,
                            userId: value,
                            roleId: user?.roleId,
                            roleName: user?.role,
                            userName: user?.firstName + ' ' + user?.lastName,
                            userEmail: user?.email,
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project member" />
                        </SelectTrigger>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.firstName + ' ' + user.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button" disabled={adding}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={adding}>
                        {adding ? <Loader className="h-4 w-4 animate-spin" /> : 'Add to Project'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project?.members?.length != 0 ? (
                    project?.members.map((member) => (
                      <TableRow key={member.userId}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-6 w-6 border object-contain">
                              <AvatarImage
                                src={member?.profilePicUrl}
                                className="object-cover"
                                alt="Profile"
                              />
                              <AvatarFallback>{member?.userName?.split('')[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member?.userName}</p>
                              <p className="text-muted-foreground text-sm">{member?.userEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member?.roleName}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeleteMember(member)
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-muted-foreground py-4 text-center">
                        No Project Members
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>A log of recent events in this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={`/avatars/${act.user.id}.png`} className="object-cover" />
                    <AvatarFallback>{act.user.initial}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-semibold">{act.user.name}</span> {act.action}{' '}
                    <span className="font-semibold">{act.issueId || act.target}</span>
                    <div className="text-muted-foreground mt-1 text-xs">{act.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Update the project's name and lead.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" defaultValue={mockProject.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectLead">Project Lead</Label>
                  <Select defaultValue={mockProject.lead.id}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProject.members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete this project and all of its associated data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setIsDeleteProjectOpen(true)}>
                  Delete Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteProjectOpen} onOpenChange={setIsDeleteProjectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all issues.
              Please type <strong>{mockProject.name}</strong> to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input className="mt-2" placeholder="Enter project name to confirm" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              I understand, delete this project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteMember} onOpenChange={() => setDeleteMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project member{' '}
              <strong>{deleteMember?.userName}</strong> from <strong>{project?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleMemberDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ProjectDetails
