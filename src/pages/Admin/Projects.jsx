import {
  Bug,
  LayoutGrid,
  List,
  MoreHorizontal,
  PlusCircle,
  Search,
  Users,
} from 'lucide-react'
import { useState } from 'react'

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

// --- MOCK DATA (same as before) ---
const mockUsers = [
  { id: 'usr_1', name: 'Liam Johnson', initial: 'LJ' },
  { id: 'usr_2', name: 'Olivia Smith', initial: 'OS' },
  { id: 'usr_3', name: 'Noah Williams', initial: 'NW' },
  { id: 'usr_4', name: 'Emma Brown', initial: 'EB' },
]

const mockProjects = [
  {
    id: 'proj_1',
    name: 'E-Commerce Platform',
    lead: mockUsers[1],
    openIssues: 23,
    members: 8,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'proj_2',
    name: 'Mobile App',
    lead: mockUsers[0],
    openIssues: 5,
    members: 4,
    lastUpdated: '1 day ago',
  },
  {
    id: 'proj_3',
    name: 'Reporting Service',
    lead: mockUsers[3],
    openIssues: 12,
    members: 5,
    lastUpdated: '3 days ago',
  },
  {
    id: 'proj_4',
    name: 'Billing System',
    lead: mockUsers[2],
    openIssues: 31,
    members: 6,
    lastUpdated: '1 week ago',
  },
  {
    id: 'proj_5',
    name: 'Internal Dashboard',
    lead: mockUsers[1],
    openIssues: 0,
    members: 3,
    lastUpdated: '2 weeks ago',
  },
]
// --- END MOCK DATA ---

const Projects = () => {
  const [projectToDelete, setProjectToDelete] = useState()
  const [searchTerm, setSearchTerm] = useState('')

  const handleDeleteClick = (project) => {
    setProjectToDelete(project)
  }

  const confirmDelete = () => {
    console.log(`Deleting project: ${projectToDelete?.name}`)
    setProjectToDelete(null)
  }

  const filteredProjects = mockProjects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 bg-muted/40">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            A list of all projects in your organization.
          </p>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Project Name</Label>
                  <Input id="name" className="col-span-3" placeholder="E.g., Mobile App Redesign"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea id="description" className="col-span-3" placeholder="A short description of the project."/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead" className="text-right">Project Lead</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs for View Switching */}
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

        {/* List View (Table) */}
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
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`/avatars/${project.lead.id}.png`} />
                            <AvatarFallback>{project.lead.initial}</AvatarFallback>
                          </Avatar>
                          <span>{project.lead.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline">{project.openIssues}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell">{project.members}</TableCell>
                      <TableCell className="hidden sm:table-cell">{project.lastUpdated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteClick(project)}>Delete</DropdownMenuItem>
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

        {/* Grid View (Cards) */}
        <TabsContent value="grid">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 pt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={`/avatars/${project.lead.id}.png`} />
                          <AvatarFallback className="text-xs">{project.lead.initial}</AvatarFallback>
                        </Avatar>
                        <span>Led by {project.lead.name}</span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteClick(project)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="grow space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      <span>{project.openIssues} Open Issues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{project.members} Members</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">Last updated {project.lastUpdated}</p>
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