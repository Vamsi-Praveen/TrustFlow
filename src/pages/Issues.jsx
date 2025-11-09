import { MoreHorizontal, PlusCircle, Search, X } from 'lucide-react'
import { useState, useMemo } from 'react'

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// --- MOCK DATA ---
const mockUsers = [
  { id: 'usr_1', name: 'Liam Johnson', initial: 'LJ' },
  { id: 'usr_2', name: 'Olivia Smith', initial: 'OS' },
  { id: 'usr_3', name: 'Noah Williams', initial: 'NW' },
  { id: 'usr_4', name: 'Emma Brown', initial: 'EB' },
]

const mockProjects = [
  { id: 'proj_1', name: 'E-Commerce Platform' },
  { id: 'proj_2', name: 'Mobile App' },
  { id: 'proj_3', name: 'Reporting Service' },
]

const mockIssues = [
  {
    id: 'BUG-8782',
    title: 'Button component overflows on mobile view',
    project: mockProjects[0],
    status: 'In Progress',
    priority: 'High',
    assignee: mockUsers[0],
    lastUpdated: '2 hours ago',
  },
  {
    id: 'TASK-4321',
    title: 'Update user authentication flow',
    project: mockProjects[1],
    status: 'Backlog',
    priority: 'Medium',
    assignee: mockUsers[1],
    lastUpdated: '1 day ago',
  },
  {
    id: 'BUG-8780',
    title: 'API returns 500 error on invalid date',
    project: mockProjects[2],
    status: 'Done',
    priority: 'High',
    assignee: mockUsers[2],
    lastUpdated: '1 day ago',
  },
  {
    id: 'FEAT-1123',
    title: 'Implement dark mode toggle',
    project: mockProjects[0],
    status: 'To Do',
    priority: 'Low',
    assignee: mockUsers[3],
    lastUpdated: '2 days ago',
  },
  {
    id: 'BUG-8779',
    title: 'Incorrect tax calculation for orders',
    project: mockProjects[0],
    status: 'In Progress',
    priority: 'Critical',
    assignee: mockUsers[0],
    lastUpdated: '3 days ago',
  },
  {
    id: 'TASK-5001',
    title: 'Set up CI/CD pipeline for deployment',
    project: mockProjects[1],
    status: 'To Do',
    priority: 'High',
    assignee: null,
    lastUpdated: '4 days ago',
  },
]

const statuses = ['Backlog', 'To Do', 'In Progress', 'Done', 'Cancelled']
const priorities = ['Low', 'Medium', 'High', 'Critical']
// --- END MOCK DATA ---

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

const Issues = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    assignee: 'all',
    project: 'all',
  })

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const clearFilters = () => {
    setFilters({ search: '', status: 'all', priority: 'all', assignee: 'all', project: 'all' })
  }

  const filteredIssues = useMemo(() => {
    return mockIssues.filter((issue) => {
      const searchMatch =
        issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.id.toLowerCase().includes(filters.search.toLowerCase())
      const statusMatch = filters.status === 'all' || issue.status === filters.status
      const priorityMatch = filters.priority === 'all' || issue.priority === filters.priority
      const assigneeMatch = filters.assignee === 'all' || issue.assignee?.id === filters.assignee
      const projectMatch = filters.project === 'all' || issue.project.id === filters.project

      return searchMatch && statusMatch && priorityMatch && assigneeMatch && projectMatch
    })
  }, [filters])

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">
            View, filter, and manage all issues across your projects.
          </p>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new issue. Select the project first.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project" className="text-right">
                    Project
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    className="col-span-3"
                    placeholder="E.g., Login button not working on Safari"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    className="col-span-3"
                    placeholder="Provide a detailed description of the issue..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Assignee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Create Issue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue List</CardTitle>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search by ID or title..."
                className="w-full pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.project} onValueChange={value => handleFilterChange('project', value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {mockProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead className="hidden md:table-cell">Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead>
                <TableHead className="hidden md:table-cell">Assignee</TableHead>
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
                  <TableCell className="hidden md:table-cell">{issue.project.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{issue.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/avatars/${issue.assignee.id}.png`} />
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {statuses.map((s) => (
                              <DropdownMenuItem key={s}>{s}</DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Assign to</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {mockUsers.map((u) => (
                              <DropdownMenuItem key={u.id}>{u.name}</DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete Issue</DropdownMenuItem>
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
            Showing <strong>{filteredIssues.length}</strong> of <strong>{mockIssues.length}</strong>{' '}
            issues
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Issues
