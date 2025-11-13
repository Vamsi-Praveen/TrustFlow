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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { DialogClose } from '@radix-ui/react-dialog'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { CloudUpload, Download, Loader, Plus, Search } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const Users = () => {
  const [data, setData] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [open, setOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const [editingUser, setEditingUser] = useState(null)

  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    roleId: '',
    role: '',
  })

  const [userToDelete, setUserToDelete] = useState(null)

  const updateUserData = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }))
  }

  const API = useAxios()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setDataLoading(true)
      const res = await API.get('/users')
      if (res.data?.success && res.data?.data) {
        setData(res.data.data)
      }
    } catch (ex) {
      console.log(ex)
      toast.error('Failed to get users')
    } finally {
      setDataLoading(false)
    }
  }

  const fetchRoles = useCallback(async () => {
    try {
      const res = await API.get('/rolepermissions/list')
      if (res.data.success && res.data.data) {
        setRoles(res.data.data)
      }
    } catch (ex) {
      console.log(ex)
      toast.error('Failed to get roles')
    }
  }, [API])

  useEffect(() => {
    if (open) fetchRoles()
  }, [open, fetchRoles])

  const columnHelper = createColumnHelper()

  const columns = [
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: 'name',
      header: 'Name',
    }),
    columnHelper.accessor('username', { header: 'Username', cell: (info) => info.getValue() }),
    columnHelper.accessor('email', { header: 'Email', cell: (info) => info.getValue() }),
    columnHelper.accessor('role', { header: 'Role', cell: (info) => info.getValue() }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const user = row.original
              setEditingUser(user)
              setUserData({
                firstname: user.firstName,
                lastname: user.lastName,
                username: user.username,
                email: user.email,
                roleId: user.roleId,
                role: user.role,
              })
              setOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              handleDelete(row.original)
            }}
          >
            Delete
          </Button>
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingUser) {
        await API.put(`/users/${editingUser.id}`, userData)
        toast.success(`User "${userData.username}" updated successfully`)
      } else {
        await API.post('/users', userData)
        toast.success(`User "${userData.username}" created successfully`)
      }
      setOpen(false)
      fetchUsers()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    toast.success('TODO: Password Reset Successfully')
  }

  const handleDelete = (user) => {
    setUserToDelete(user)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    try {
      await API.delete(`/users/${userToDelete.id}`)
      toast.success(`User ${userToDelete.username} deleted successfully`)
      fetchUsers()
    } catch (error) {
      toast.error(`Failed to delete user ${userToDelete.username}`)
    } finally {
      setUserToDelete(null)
    }
  }

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      // Reset state when the dialog is closed
      setSelectedFile(null)
      setIsLoading(false)
    }
    setBulkOpen(isOpen)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 2MB.')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  const handleFileSubmit = async (event) => {
    event.preventDefault()
    if (!selectedFile) {
      toast.error('Please select a file to upload.')
      return
    }
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await API.post('/users/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(res.data?.message || 'File uploaded successfully! Users are being processed.')
      if (onUploadSuccess) {
        onUploadSuccess()
      }
      setOpen(false)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Upload failed. Please check the file and try again.',
      )
      console.error('Bulk upload error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadTemplate = () => {
    const csvHeader = 'FirstName,LastName,Email,Role\n'
    const csvContent = 'data:text/csv;charset=utf-8,' + csvHeader
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'Template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-gray-500">Manage application users</p>
        </div>

        <div className="space-x-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingUser(null)
                  setUserData({
                    firstname: '',
                    lastname: '',
                    username: '',
                    email: '',
                    roleId: '',
                    role: '',
                  })
                  setOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                  <DialogDescription>
                    Fill in the details to {editingUser ? 'edit' : 'add a new'} user.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstname" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="firstname"
                      value={userData.firstname}
                      onChange={(e) => updateUserData('firstname', e.target.value)}
                      className="col-span-3"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastname" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="lastname"
                      value={userData.lastname}
                      onChange={(e) => updateUserData('lastname', e.target.value)}
                      className="col-span-3"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={userData.username}
                      onChange={(e) => updateUserData('username', e.target.value)}
                      className="col-span-3"
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={userData.email}
                      onChange={(e) => updateUserData('email', e.target.value)}
                      className="col-span-3"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select
                      value={userData.roleId}
                      onValueChange={(value) => {
                        const selected = roles.find((r) => r.id === value)
                        updateUserData('roleId', value)
                        updateUserData('role', selected?.roleName || '')
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
                  {editingUser && (
                    <Button type="button" variant="secondary" onClick={resetPassword}>
                      Reset Password
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : editingUser ? (
                      'Save Changes'
                    ) : (
                      'Create User'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={bulkOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CloudUpload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create Users in Bulk</DialogTitle>
                  <DialogDescription>
                    Upload a .csv or .xlsx file to create multiple users at once.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                  {/* Step 1: Download Template */}
                  <div className="bg-background flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-semibold">Download Template</h3>
                      <p className="text-muted-foreground text-sm">
                        Use our template to ensure correct formatting.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Template.csv
                    </Button>
                  </div>

                  {/* Step 2: File Input Area */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                    <div
                      className="hover:bg-muted flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6"
                      onClick={handleBrowseClick}
                    >
                      <CloudUpload className="text-muted-foreground h-10 w-10" />
                      <p className="text-muted-foreground mt-2 text-sm">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-muted-foreground text-xs">CSV or XLSX (max. 2MB)</p>
                    </div>
                  </div>

                  {/* Step 3: Display Selected File */}
                  {selectedFile && (
                    <div>
                      <Label className="mb-2 block">Selected File</Label>
                      <div className="bg-background flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <File className="text-muted-foreground h-5 w-5" />
                          <div className="text-sm">
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setSelectedFile(null)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isLoading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading || !selectedFile}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <CloudUpload className="mr-2 h-4 w-4" /> Upload File
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {dataLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center">
                  <Loader className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-end space-x-2">
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

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              <span className="font-bold text-red-500"> "{userToDelete?.username}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-400 transition hover:bg-red-500"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Users
