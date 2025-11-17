import { Bug, LayoutGrid, List, MoreHorizontal, Search, X } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// --- MOCK DATA ---
// This data represents issues ASSIGNED TO THE CURRENT LOGGED-IN USER.
const mockProjects = [
  { id: 'proj_1', name: 'E-Commerce Platform' },
  { id: 'proj_2', name: 'Mobile App' },
  { id: 'proj_3', name: 'Reporting Service' },
]

const mockMyIssues = [
  {
    id: 'BUG-8782',
    title: 'Button component overflows on mobile view',
    project: mockProjects[0],
    status: 'In Progress',
    priority: 'High',
  },
  {
    id: 'TASK-5001',
    title: 'Set up CI/CD pipeline for deployment',
    project: mockProjects[1],
    status: 'To Do',
    priority: 'High',
  },
  {
    id: 'FEAT-1123',
    title: 'Implement dark mode toggle',
    project: mockProjects[0],
    status: 'To Do',
    priority: 'Low',
  },
  {
    id: 'BUG-8779',
    title: 'Incorrect tax calculation for international orders',
    project: mockProjects[0],
    status: 'In Progress',
    priority: 'Critical',
  },
  {
    id: 'DOCS-0012',
    title: 'Write documentation for the new API endpoints',
    project: mockProjects[2],
    status: 'To Do',
    priority: 'Medium',
  },
  {
    id: 'BUG-9001',
    title: 'User session expires unexpectedly',
    project: mockProjects[1],
    status: 'Backlog',
    priority: 'High',
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

// Reusable Issue Card for the Kanban Board
const IssueCard = ({ issue }) => (
  <Card className="mb-4 cursor-grab transition-shadow hover:shadow-md active:cursor-grabbing">
    <CardContent className="p-4">
      <div className="mb-2 flex items-start justify-between">
        <p className="pr-2 text-sm leading-tight font-semibold">{issue.title}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityBadgeVariant(issue.priority)}>{issue.priority}</Badge>
          <span className="text-foreground font-medium">{issue.id}</span>
        </div>
        <span className="font-medium">{issue.project.name}</span>
      </div>
    </CardContent>
  </Card>
)

const MyIssues = () => {
  const [filters, setFilters] = useState({
    search: '',
    project: 'all',
    priority: 'all',
  })

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const clearFilters = () => {
    setFilters({ search: '', project: 'all', priority: 'all' })
  }

  const filteredIssues = useMemo(() => {
    return mockMyIssues.filter((issue) => {
      if (issue.status === 'Done' || issue.status === 'Cancelled') return false // Default to showing only open issues
      const searchMatch =
        issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.id.toLowerCase().includes(filters.search.toLowerCase())
      const projectMatch = filters.project === 'all' || issue.project.id === filters.project
      const priorityMatch = filters.priority === 'all' || issue.priority === filters.priority

      return searchMatch && projectMatch && priorityMatch
    })
  }, [filters])

  const boardColumns = useMemo(
    () => [
      {
        id: 'backlog',
        title: 'Backlog',
        issues: filteredIssues.filter((i) => i.status === 'Backlog'),
      },
      { id: 'todo', title: 'To Do', issues: filteredIssues.filter((i) => i.status === 'To Do') },
      {
        id: 'inprogress',
        title: 'In Progress',
        issues: filteredIssues.filter((i) => i.status === 'In Progress'),
      },
    ],
    [filteredIssues],
  )

  return (
    <div className="bg-muted/40 min-h-screen flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Issues</h1>
          <p className="text-muted-foreground">All issues assigned to you across all projects.</p>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <TabsList>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="board">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1 sm:min-w-[250px]">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search by ID or title..."
                className="w-full pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <Select
              value={filters.project}
              onValueChange={(value) => handleFilterChange('project', value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
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
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* --- List View --- */}
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.length > 0 ? (
                      filteredIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>
                            <div className="font-medium">{issue.id}</div>
                            <div className="text-muted-foreground text-sm">{issue.title}</div>
                          </TableCell>
                          <TableCell>{issue.project.name}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                              {issue.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{issue.status}</Badge>
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
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No open issues assigned to you. Great job!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Board View --- */}
        <TabsContent value="board" className="p-0">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            {boardColumns.map((column) => (
              <div key={column.id} className="bg-background rounded-lg">
                <div className="border-b p-4">
                  <h3 className="text-lg font-semibold capitalize">
                    {column.title}{' '}
                    <Badge variant="secondary" className="ml-2">
                      {column.issues.length}
                    </Badge>
                  </h3>
                </div>
                <div className="h-[60vh] overflow-y-auto p-4">
                  {column.issues.length > 0 ? (
                    column.issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
                  ) : (
                    <div className="text-muted-foreground pt-4 text-center text-sm">
                      No issues in this column.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MyIssues
