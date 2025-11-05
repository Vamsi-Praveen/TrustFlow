import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// --- MOCK DATA ---
const mockData = {
  statuses: [
    { id: 'stat_1', name: 'To Do' },
    { id: 'stat_2', name: 'In Progress' },
    { id: 'stat_3', name: 'In Review' },
    { id: 'stat_4', name: 'Done' },
  ],
  priorities: [
    { id: 'pri_1', name: 'Low' },
    { id: 'pri_2', name: 'Medium' },
    { id: 'pri_3', name: 'High' },
    { id: 'pri_4', name: 'Critical' },
  ],
  severities: [
    { id: 'sev_1', name: 'Cosmetic' },
    { id: 'sev_2', name: 'Minor' },
    { id: 'sev_3', name: 'Major' },
    { id: 'sev_4', name: 'Blocker' },
  ],
  types: [
    { id: 'type_1', name: 'Bug' },
    { id: 'type_2', name: 'Feature Request' },
    { id: 'type_3', name: 'Task' },
    { id: 'type_4', name: 'Improvement' },
  ],
}

const configTabs = [
  { value: 'statuses', label: 'Statuses', data: mockData.statuses },
  { value: 'priorities', label: 'Priorities', data: mockData.priorities },
  { value: 'severities', label: 'Severities', data: mockData.severities },
  { value: 'types', label: 'Types', data: mockData.types },
]
// --- END MOCK DATA ---

const Configurations = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState('statuses')
  const [itemName, setItemName] = useState('')

  const activeConfig = configTabs.find(tab => tab.value === activeTab)

  const handleCreateClick = () => {
    setEditingItem(null)
    setItemName('')
    setIsDialogOpen(true)
  }
  
  const handleEditClick = (item) => {
    setEditingItem(item)
    setItemName(item.name)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
  }

  const confirmDelete = () => {
    console.log(`Deleting ${activeConfig.label}: ${itemToDelete?.name}`)
    setItemToDelete(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (editingItem) {
      console.log(`Updating ${activeConfig.label}:`, { id: editingItem.id, name: itemName })
    } else {
      console.log(`Creating new ${activeConfig.label}:`, { name: itemName })
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 bg-muted/40 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Configurations</h1>
        <p className="text-muted-foreground">
          Manage customizable options for your bug tracking tool.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          {configTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        
        {configTabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{tab.label}</CardTitle>
                  <CardDescription>
                    Define the available {tab.label.toLowerCase()} for issues.
                  </CardDescription>
                </div>
                <Button onClick={handleCreateClick}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New {tab.label.slice(0, -1)}
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tab.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleEditClick(item)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteClick(item)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Create'} {activeConfig.label.slice(0, -1)}</DialogTitle>
              <DialogDescription>
                Enter the name for the {activeConfig.label.toLowerCase().slice(0, -1)}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="item-name">Name</Label>
                <Input id="item-name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the item <span className="font-bold">"{itemToDelete?.name}"</span>. This action cannot be undone.
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

export default Configurations