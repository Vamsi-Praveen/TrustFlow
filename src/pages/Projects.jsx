import {
  Bug,
  LayoutGrid,
  List,
  Loader,
  MoreHorizontal,
  PlusCircle,
  Search,
  Users,
} from 'lucide-react'
import { useCallback, useEffect, useState, useMemo } from 'react'

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
  DropdownMenuLabel,
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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
import { timeAgo } from '@/helpers/TimeConversion'
import useAxios from '@/hooks/useAxios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Projects = () => {
  const [projectToDelete, setProjectToDelete] = useState()

  const [projects, setProjects] = useState([])

  const [isDataLoading, setDataLoading] = useState(false)

  const [users, setUsers] = useState([])

  const [projectEditing, setProjectEditing] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const [project, setProject] = useState({
    name: '',
    description: '',
    leadUserId: '',
    leadUserName: '',
    managerUserId: '',
    managerUserName: '',
    members: [],
  })

  const [globalFilter, setGlobalFilter] = useState('')

  const [open, setOpen] = useState(false)

  const { hasPermission, role } = useAuth()

  const navigate = useNavigate()

  const API = useAxios()

  useEffect(() => {
    fetchProjects()
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

  const fetchProjects = useCallback(async () => {
    try {
      setDataLoading(true)

      const normalizedRole = role?.toLowerCase()
      console.log(normalizedRole)
      const isAdminRole = ['administrator', 'admin'].includes(normalizedRole)

      const endpoint = isAdminRole ? '/projects' : '/projects/myprojects'
      const res = await API.get(endpoint)

      if (res.data?.success && res.data?.data) {
        setProjects(res.data.data)
      }
    } catch (ex) {
      console.log(ex)
      toast.error('Failed to fetch projects')
    } finally {
      setDataLoading(false)
    }
  }, [API, role, setDataLoading, setProjects])

  const updateProjectData = (key, value) => {
    setProject((prev) => ({ ...prev, [key]: value }))
  }

  const handleDeleteClick = (project) => {
    setProjectToDelete(project)
  }

  const confirmDelete = () => {
    setProjectToDelete(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!project.name.trim()) {
      toast.error('Project name is required')
      setIsLoading(false)
      return
    }
    if (!project.description.trim()) {
      toast.error('Project description is required')
      setIsLoading(false)
      return
    }
    if (!project.leadUserId) {
      toast.error('Please select a project lead')
      setIsLoading(false)
      return
    }
    if (!project.managerUserId) {
      toast.error('Please select a project manager')
      setIsLoading(false)
      return
    }
    try {
      if (projectEditing) {
        await API.put(`/projects/${projectEditing.id}`, project)
        toast.success(`Project "${project.name}" updated successfully`)
      } else {
        await API.post('/projects', project)
        toast.success(`Project "${project.name}" created successfully`)
      }
      setOpen(false)
      fetchProjects()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()
    return [
      columnHelper.accessor('name', {
        header: 'Project Name',
        cell: (info) => <div className="font-medium">{info.getValue()}</div>,
      }),
      columnHelper.accessor('leadUserName', {
        header: 'Lead',
        cell: ({ row }) => {
          const project = row.original
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={project.leadProfilePicUrl} />
                <AvatarFallback>{project.leadUserName?.split('')[0]}</AvatarFallback>
              </Avatar>
              <span>{project.leadUserName}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor('openIssues', {
        header: 'Open Issues',
        cell: (info) => <Badge variant="outline">{info.getValue() || 0}</Badge>,
      }),
      columnHelper.accessor('members', {
        header: 'Members',
        cell: (info) => info.getValue()?.length || 0,
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Last Updated',
        cell: (info) => timeAgo(info.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          const project = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(`/projectdetails/${project.id}`)}>
                  View Details
                </DropdownMenuItem>
                {hasPermission('CanEditProject') && (
                  <DropdownMenuItem
                    onClick={() => {
                      setProjectEditing(project)
                      setProject(project)
                      setOpen(true)
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                )}
                {hasPermission('CanDeleteProject') && (
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={() => handleDeleteClick(project)}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }),
    ]
  }, [hasPermission, navigate])

  const table = useReactTable({
    data: projects,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const filteredProjectsForGrid = projects.filter((project) =>
    project.name.toLowerCase().includes(globalFilter.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">A list of all projects in your organization.</p>
        </div>
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            {hasPermission('CanCreateProject') && (
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setProject({
                      name: '',
                      description: '',
                      leadUserId: '',
                      leadUserName: '',
                      managerUserId: '',
                      managerUserName: '',
                      members: [],
                    })
                    setOpen(true)
                    setProjectEditing(null)
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new project.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="name" className="w-32 text-right">
                      Project Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="E.g.,Mobile App Redesign"
                      className="flex-1"
                      value={project.name}
                      onChange={(e) => updateProjectData('name', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Label htmlFor="description" className="w-32 text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Short project description"
                      className="flex-1"
                      value={project.description}
                      onChange={(e) => updateProjectData('description', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Label htmlFor="lead" className="w-32 text-right">
                      Project Lead
                    </Label>
                    <Select
                      value={project.leadUserId}
                      onValueChange={(value) => {
                        const user = users.find((u) => u.id == value)
                        updateProjectData('leadUserId', value)
                        updateProjectData('leadUserName', user?.firstName + ' ' + user?.lastName)
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName + ' ' + user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label htmlFor="manager" className="w-32 text-right">
                      Project Manager
                    </Label>
                    <Select
                      value={project.managerUserId}
                      onValueChange={(value) => {
                        const user = users.find((u) => u.id == value)
                        updateProjectData('managerUserId', value)
                        updateProjectData('managerUserName', user?.firstName + ' ' + user?.lastName)
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName + ' ' + user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isLoading}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {' '}
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : projectEditing ? (
                      'Save Changes'
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="grid">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Grid View
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="list">
          <Card>
            <CardContent className="px-3">
              <div>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="px-5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isDataLoading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          <Loader className="mx-auto h-6 w-6 animate-spin" />
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-4 py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No projects found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-muted-foreground text-xs">
                Showing <strong>{table.getRowModel().rows.length}</strong> of{' '}
                <strong>{projects.length}</strong> projects.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="grid">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjectsForGrid.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2 py-2">
                        <Avatar className="h-5 w-5 border object-contain">
                          <AvatarImage
                            src={project.leadProfilePicUrl}
                            className="object-cover"
                            alt="Profile"
                          />
                          <AvatarFallback>{project.leadUserName?.split('')[0]}</AvatarFallback>
                        </Avatar>
                        <span>Led by {project.leadUserName}</span>
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 border object-contain">
                          <AvatarImage
                            src={project?.managerProfilePicUrl}
                            className="object-cover"
                            alt="Profile"
                          />
                          <AvatarFallback>{project.managerUserName?.split('')[0]}</AvatarFallback>
                        </Avatar>
                        <span>Managed by {project.managerUserName}</span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            navigate(`/projectdetails/${project.id}`)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        {hasPermission('CanEditProject') && (
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        )}
                        {hasPermission('CanDeleteProject') && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={() => handleDeleteClick(project)}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="grow space-y-4">
                  <div className="text-muted-foreground flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      <span>{project?.openIssues || 0} Open Issues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{project?.members?.length} Members</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-muted-foreground text-xs">
                    Last updated {timeAgo(project.updatedAt)}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredProjectsForGrid.length === 0 && (
            <div className="text-muted-foreground py-12 text-center">
              <p>No projects found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              <span className="font-bold"> "{projectToDelete?.name}" </span>
              and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Projects
