import {
  Bug,
  LayoutGrid,
  List,
  MoreHorizontal,
  PlusCircle,
  Search,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
import { timeAgo } from '@/helpers/TimeConversion'
import useAxios from '@/hooks/useAxios'
import { toast } from 'sonner'


const Projects = () => {

  const [projectToDelete, setProjectToDelete] = useState()

  const [searchTerm, setSearchTerm] = useState('')

  const [projects, setProjects] = useState([]);

  const [isDataLoading, setDataLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [project, setProject] = useState({
    "name": "",
    "description": "",
    "leadUserId": "",
    "leadUserName": "",
    "managerUserId":"",
    "members": []
  })

  const [open, setOpen] = useState(false)


  const { hasPermission } = useAuth();

  const API = useAxios();

  useEffect(() => {
    fetchProjects();
  }, [])


  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      if (res.data?.success && res.data?.data) {
        setUsers(res.data.data);
      }
    }
    catch (ex) {
      console.log(ex);
      toast.error("Failed to get users");
    }
  }

  const fetchProjects = async () => {
    try {
      setDataLoading(true);
      const res = await API.get('/projects');
      if (res.data?.success && res.data?.data) {
        setProjects(res.data.data);
      }
    }
    catch (ex) {
      console.log(ex);
      toast.error("Failed to fetch projects");
    }
    finally {
      setDataLoading(false)
    }
  }


  const updateProjectData = (key, value) => {
    setProject(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project)
  }

  const confirmDelete = () => {
    console.log(`Deleting project: ${projectToDelete?.name}`)
    setProjectToDelete(null)
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            A list of all projects in your organization.
          </p>
        </div>
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            {hasPermission("CanCreateProject") && (
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setProject({
                      "name": "",
                      "description": "",
                      "leadUserId": "",
                      "leadUserName": "",
                      "managerUserId":"",
                      "members": []
                    });
                    setOpen(true)
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
                </Button>
              </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[425px]">
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
                  <Input id="name" placeholder="E.g.,Mobile App Redesign" className="flex-1" value={project.name} onChange={(e)=>updateProjectData("name",e.target.value)} />
                </div>

                <div className="flex items-center gap-3">
                  <Label htmlFor="description" className="w-32 text-right">
                    Description
                  </Label>
                  <Textarea id="description" placeholder="Short project description" className="flex-1" value={project.description} onChange={(e)=>updateProjectData("description",e.target.value)} />
                </div>

                <div className="flex items-center gap-3">
                  <Label htmlFor="lead" className="w-32 text-right">
                    Project Lead
                  </Label>
                  <Select value={project.leadUserId} onValueChange={(value)=>updateProjectData("leadUserId",value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName + " " + user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Label htmlFor="manager" className="w-32 text-right">
                    Project Manager
                  </Label>
                  <Select value={project.managerUserId} onValueChange={(value)=>updateProjectData("managerUserId",value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName + " " + user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list"><List className="mr-2 h-4 w-4" />List View</TabsTrigger>
            <TabsTrigger value="grid"><LayoutGrid className="mr-2 h-4 w-4" />Grid View</TabsTrigger>
          </TabsList>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="list">
          <Card>
            <CardContent className="px-4 py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Lead</TableHead>
                    <TableHead className="hidden md:table-cell">Open Issues</TableHead>
                    <TableHead className="hidden md:table-cell">Members</TableHead>
                    <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 object-contain border">
                            <AvatarImage src={`https://avatar.iran.liara.run/username?username=${project.leadUserName}`} alt="Profile" />
                            <AvatarFallback>{project.leadUserName?.split("")[0]}</AvatarFallback>
                          </Avatar>
                          <span>{project.leadUserName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline">{project.openIssues || 1}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell">{project?.members?.length}</TableCell>
                      <TableCell className="hidden sm:table-cell">{timeAgo(project.updatedAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {
                              hasPermission("CanEditProject") && <DropdownMenuItem>Edit</DropdownMenuItem>
                            }
                            {
                              hasPermission("CanDeleteProject") && <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteClick(project)}>Delete</DropdownMenuItem>
                            }
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">Showing <strong>1-{filteredProjects.length}</strong> of <strong>{filteredProjects.length}</strong> projects</div>
              <div className="ml-auto"><Button size="sm" variant="outline" disabled>Previous</Button><Button size="sm" variant="outline" className="ml-2">Next</Button></div>
            </CardFooter>
          </Card>
        </TabsContent>


        <TabsContent value="grid">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 pt-1">
                        <Avatar className="w-5 h-5 object-contain border">
                          <AvatarImage src={`https://avatar.iran.liara.run/username?username=${project.leadUserName}`} alt="Profile" />
                          <AvatarFallback>{project.leadUserName?.split("")[0]}</AvatarFallback>
                        </Avatar>
                        <span>Led by {project.leadUserName}</span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {
                          hasPermission("CanEditProject") && <DropdownMenuItem>Edit</DropdownMenuItem>
                        }
                        {
                          hasPermission("CanDeleteProject") && <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteClick(project)}>Delete</DropdownMenuItem>
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="grow space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
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
                  <p className="text-xs text-muted-foreground">Last updated {timeAgo(project.updatedAt)}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No projects found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog (shared) */}
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