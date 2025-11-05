import { MoreHorizontal, PlusCircle, Shield, User } from 'lucide-react'
import { useEffect, useState } from 'react'

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
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import api from '@/api/axios'

const defaultPermissions = {
  canCreateProject: false,
  canEditProject: false,
  canDeleteProject: false,
  canCreateBug: false,
  canEditBug: false,
  canChangeBugStatus: false,
  canCommentOnBug: false,
  canAdminSettings: false,
}

const permissionList = [
  { id: 'canCreateProject', label: 'Create Projects' },
  { id: 'canEditProject', label: 'Edit Projects' },
  { id: 'canDeleteProject', label: 'Delete Projects' },
  { id: 'canCreateBug', label: 'Create Bugs/Issues' },
  { id: 'canEditBug', label: 'Edit Bugs/Issues' },
  { id: 'canChangeBugStatus', label: 'Change Bug Status' },
  { id: 'canCommentOnBug', label: 'Comment on Bugs' },
  { id: 'canAdminSettings', label: 'Manage Admin Settings' },
]

const Roles = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState()
  const [roleToDelete, setRoleToDelete] = useState()
  
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [currentPermissions, setCurrentPermissions] = useState(defaultPermissions)

  const [roles,setRoles] = useState([])

  // When 'editingRole' changes, populate the form state
  // useEffect(() => {
  //   if (editingRole) {
  //     setRoleName(editingRole.name)
  //     setRoleDescription(editingRole.description)
  //     setCurrentPermissions(editingRole.permissions)
  //   } else {
  //     // Reset form for "Create" mode
  //     setRoleName('')
  //     setRoleDescription('')
  //     setCurrentPermissions(defaultPermissions)
  //   }
  // }, [editingRole])


  useEffect(()=>{
    fetchRoles();
  },[])

  const fetchRoles = async()=>{
    try{
      const res = await api.get('/rolepermissions');
      if(res.data.success && res.data.data){
        setRoles(res.data.data);
      }
    }
    catch(ex){

    }
    finally{
    }
  }

  const handleCreateClick = () => {
    setEditingRole(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (role) => {
    setEditingRole(role)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (role) => {
    setRoleToDelete(role)
  }

  const confirmDelete = () => {
    console.log(`Deleting role: ${roleToDelete?.name}`)
    setRoleToDelete(null)
  }

  const handlePermissionChange = (permissionId,checked) => {
    setCurrentPermissions(prev => ({ ...prev, [permissionId]: checked }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const roleData = { name: roleName, description: roleDescription, permissions: currentPermissions }
    if (editingRole) {
      console.log('Updating role:', { id: editingRole.id, ...roleData })
    } else {
      console.log('Creating new role:', roleData)
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 bg-muted/40 min-h-screen">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage application user roles and their permissions.
          </p>
        </div>
        <div>
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Role
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
          <CardDescription>
            Assign permissions to roles to control user access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Users</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {console.log(roles)}
              {roles.map((role) => (
                <TableRow key={role.role.id}>
                  <TableCell className="font-medium">{role.role.roleName}</TableCell>
                  <TableCell>{role.role.description}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{role.userCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEditClick(role)}>Edit Permissions</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteClick(role)}>Delete Role</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{roles.length}</strong> of <strong>{roles.length}</strong> roles
          </div>
        </CardFooter>
      </Card>

      {/* Create/Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
              <DialogDescription>
                Set the name, description, and permissions for this role.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input id="role-name" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="E.g., Product Manager" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea id="role-description" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} placeholder="A short description of this role." />
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium">Permissions</h3>
                <p className="text-sm text-muted-foreground">Select the permissions this role should have.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {permissionList.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={currentPermissions[permission.id]}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id,checked)}
                    />
                    <Label htmlFor={permission.id} className="font-normal">{permission.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              <span className="font-bold"> "{roleToDelete?.name}"</span>. 
              Users assigned to this role will lose their permissions.
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

export default Roles