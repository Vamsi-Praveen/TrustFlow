import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useAxios from '@/hooks/useAxios'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader, Plus, Search } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const Users = () => {

  const [data, setData] = useState([])
  const [dataLoading, setDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false)

  const [editingUser, setEditingUser] = useState(null);

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    roleId: "",
    roleName: ""
  });

  const updateUserData = (key, value) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  const API = useAxios();

  useEffect(() => {
    fetchUser();
  }, [])

  const fetchUser = async () => {
    try {
      setDataLoading(true);
      const res = await API.get('/users');
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
    }
    catch (ex) {
      console.log(ex);
      toast.error("Failed to get users");
    }
    finally {
      setDataLoading(false)
    }
  }

  const fetchRoles = useCallback(async () => {
    try {
      const res = await API.get('/rolepermissions/list');
      if (res.data.success && res.data.data) {
        setRoles(res.data.data);
      }
    } catch (ex) {
      console.log(ex);
      toast.error("Failed to get roles");
    }
  }, [API]);

  useEffect(() => {
    if (open) fetchRoles();
  }, [open, fetchRoles]);

  const columnHelper = createColumnHelper()

  const columns = [
    columnHelper.accessor(
      row => `${row.firstName} ${row.lastName}`,
      {
        id: "name",
        header: "Name",
      }
    ),
    columnHelper.accessor('username', { header: 'Username', cell: info => info.getValue() }),
    columnHelper.accessor('email', { header: 'Email', cell: info => info.getValue() }),
    columnHelper.accessor('role', { header: 'Role', cell: info => info.getValue() }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const user = row.original;
              setEditingUser(user);
              setUserData({
                firstname: user.firstName,
                lastname: user.lastName,
                username: user.username,
                email: user.email,
                roleId: user.roleId,
                roleName: user.roleName
              });
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      ),
    }),
  ]

  const [globalFilter, setGlobalFilter] = useState('')
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, value) =>
      String(row.getValue(columnId)).toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    try{

    }
    catch(ex){

    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-gray-500">Manage application users</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingUser(null);
                setUserData({
                  firstname: "",
                  lastname: "",
                  username: "",
                  email: "",
                  roleId: "",
                  roleName: ""
                });
                setOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new user.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstname" className="text-right">First Name</Label>
                  <Input
                    id="firstname"
                    value={userData.firstname}
                    onChange={(e) => updateUserData("firstname", e.target.value)}
                    className="col-span-3"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastname" className="text-right">Last Name</Label>
                  <Input
                    id="lastname"
                    value={userData.lastname}
                    onChange={(e) => updateUserData("lastname", e.target.value)}
                    className="col-span-3"
                    placeholder="Enter last name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">Username</Label>
                  <Input
                    id="username"
                    value={userData.username}
                    onChange={(e) => updateUserData("username", e.target.value)}
                    className="col-span-3"
                    placeholder="Enter username"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    value={userData.email}
                    onChange={(e) => updateUserData("email", e.target.value)}
                    className="col-span-3"
                    placeholder="Enter email"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Select
                    value={userData.roleId}
                    onValueChange={(value) => {
                      const selected = roles.find((r) => r.id === value);
                      updateUserData("roleId", value);
                      updateUserData("roleName", selected?.roleName || "");
                    }}
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.roleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className="animate-spin" /> : editingUser ? 'Save Changes' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {
              dataLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <Loader className="mx-auto size-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      No matching users found.
                    </TableCell>
                  </TableRow>
                )
              )
            }
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 mt-4">
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
  )
}

export default Users
