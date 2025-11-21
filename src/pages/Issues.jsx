import { MoreHorizontal, PlusCircle, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import useAxios from '@/hooks/useAxios'

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
  const API = useAxios()

  const [issues, setIssues] = useState([])
  const [statuses, setStatuses] = useState([])
  const [priorities, setPriorities] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])

  const [open, setOpen] = useState(false)

  const fetchIssues = async () => {
    try {
      const res = await API.get('/issues')
      if (res?.data?.success && res?.data?.data) {
        setIssues(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users')
      if (res?.data?.success && res?.data?.data) {
        setUsers(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchIssueFilters = async () => {
    try {
      const res = await API.get('/issues/filters')
      if (res?.data?.success && res?.data?.data) {
        setPriorities(res?.data?.data?.priorities)
        setStatuses(res?.data?.data?.statuses)
        setProjects(res?.data?.data?.projects)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchIssues()
    fetchIssueFilters()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [open])

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
    return issues.filter((issue) => {
      const searchMatch =
        issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.issueId.toLowerCase().includes(filters.search.toLowerCase())

      const statusMatch = filters.status === 'all' || issue.status === filters.status

      const priorityMatch = filters.priority === 'all' || issue.priority === filters.priority

      const projectMatch = filters.project === 'all' || issue.projectId === filters.project

      return searchMatch && statusMatch && priorityMatch && projectMatch
    })
  }, [filters, issues])

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
          <Dialog open={open} onOpenChange={setOpen}>
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
                      {projects.map((p) => (
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
                    className="col-span-3 h-40"
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
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.fullName}
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
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
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
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.project}
                onValueChange={(value) => handleFilterChange('project', value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-3">Issue</TableHead>
                  <TableHead className="hidden p-3 md:table-cell">Project</TableHead>
                  <TableHead className="p-3">Status</TableHead>
                  <TableHead className="hidden p-3 sm:table-cell">Priority</TableHead>
                  <TableHead className="hidden p-3 md:table-cell">Assignee</TableHead>
                  <TableHead>
                    <span className="sr-only p-3">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="p-3">
                      <div className="font-medium">{issue.issueId}</div>
                      <div className="text-muted-foreground text-sm">{issue.title}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{issue.projectName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {statuses.find((s) => s.id == issue.status)?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={getPriorityBadgeVariant(
                          priorities.find((p) => p.id == issue.priority)?.name,
                        )}
                      >
                        {priorities.find((p) => p.id == issue.priority)?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {issue.assigneeUserIds[0] ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`/avatars/${issue.assigneeUserIds[0]}.png`} />
                            <AvatarFallback className="text-xs">
                              {issue.assigneeUserNames[0].split('')[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{issue.assigneeUserNames[0]}</span>
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
                                <DropdownMenuItem key={s.id}>{s.name}</DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Assign to</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {users.map((u) => (
                                <DropdownMenuItem key={u.id}>{u.fullName}</DropdownMenuItem>
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
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground text-xs">
            Showing <strong>{filteredIssues.length}</strong> of <strong>{issues?.length}</strong>{' '}
            issues
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Issues
