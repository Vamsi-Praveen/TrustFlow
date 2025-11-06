import { Loader, MoreHorizontal, PlusCircle } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'

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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import useAxios from '@/hooks/useAxios'

const defaultPermissions = {
  canCreateProject: false,
  canEditProject: false,
  canDeleteProject: false,
  canCreateBug: false,
  canEditBug: false,
  canChangeBugStatus: false,
  canCommentOnBugs: false,
  canManageAdminSettings: false,
}

const permissionList = [
  { id: 'canCreateProject', label: 'Create Projects' },
  { id: 'canEditProject', label: 'Edit Projects' },
  { id: 'canDeleteProject', label: 'Delete Projects' },
  { id: 'canCreateBug', label: 'Create Bugs/Issues' },
  { id: 'canEditBug', label: 'Edit Bugs/Issues' },
  { id: 'canChangeBugStatus', label: 'Change Bug Status' },
  { id: 'canCommentOnBugs', label: 'Comment on Bugs' },
  { id: 'canManageAdminSettings', label: 'Manage Admin Settings' },
]

const Roles = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [roleToDelete, setRoleToDelete] = useState(null)

  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [currentPermissions, setCurrentPermissions] = useState(defaultPermissions)

  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)

  const API = useAxios();

  const resetForm = () => {
    setRoleName('')
    setRoleDescription('')
    setCurrentPermissions(defaultPermissions)
  }

  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.roleName)
      setRoleDescription(editingRole.description)

      const updatedPermissions = {
        ...defaultPermissions,
        ...Object.fromEntries(
          Object.entries(editingRole).filter(([key]) => key.startsWith('can'))
        ),
      }
      setCurrentPermissions(updatedPermissions)
    } else {
      resetForm()
    }
  }, [editingRole])

  const fetchRoles = useCallback(async () => {
    try {
      setIsDataLoading(true)
      const res = await API.get('/rolepermissions')
      if (res.data.success && res.data.data) setRoles(res.data.data)
    } catch (ex) {
      toast.error('Failed to retrieve roles')
    } finally {
      setIsDataLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleEditClick = (role) => {
    setEditingRole(role.role)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (role) => setRoleToDelete(role.role)

  const confirmDelete = async () => {
    if (!roleToDelete) return
    try {
      await API.delete(`/rolepermissions/${roleToDelete.id}`)
      toast.success(`Role ${roleToDelete.roleName} deleted successfully`)
      fetchRoles()
    } catch (error) {
      toast.error(`Failed to delete role ${roleToDelete.roleName}`)
    } finally {
      setRoleToDelete(null)
    }
  }

  const handlePermissionChange = (id, checked) => {
    setCurrentPermissions((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const hasAtLeastOnePermission = Object.values(currentPermissions).some((v) => v === true)
    if (!hasAtLeastOnePermission) {
      toast.error("Please select at least one permission for this role.")
      setIsLoading(false);
      return;
    }

    const now = new Date().toISOString()
    const roleData = {
      createdAt: editingRole?.createdAt || now,
      updatedAt: now,
      roleName,
      description: roleDescription,
      ...currentPermissions,
    }

    try {
      if (editingRole) {
        await API.put(`/rolepermissions/${editingRole.id}`, roleData)
        toast.success(`Role "${roleName}" updated successfully`)
      } else {
        await API.post('/rolepermissions', roleData)
        toast.success(`Role "${roleName}" created successfully`)
      }

      fetchRoles()
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 bg-muted/40 min-h-screen">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">Manage application user roles and their permissions.</p>
        </div>
        <Button onClick={() => { setEditingRole(null); setIsDialogOpen(true) }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
          <CardDescription>Assign permissions to roles to control user access.</CardDescription>
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
              {isDataLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <Loader className="mx-auto size-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.role.id}>
                    <TableCell className="font-medium">{role.role.roleName}</TableCell>
                    <TableCell>{role.role.description}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary">{role.userCount}</Badge>
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
                          <DropdownMenuItem onSelect={() => handleEditClick(role)}>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteClick(role)}>Delete Role</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{roles.length}</strong> of <strong>{roles.length}</strong> roles
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
              <DialogDescription>Set the name, description, and permissions for this role.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Role Name</Label>
                <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="E.g., Product Manager" />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} placeholder="A short description of this role." />
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
                      checked={currentPermissions[permission.id]}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                    />
                    <Label className="font-normal">{permission.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : editingRole ? 'Edit Role' : 'Save Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              <span className="font-bold text-red-500"> "{roleToDelete?.roleName}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-400 hover:bg-red-500 transition">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Roles
