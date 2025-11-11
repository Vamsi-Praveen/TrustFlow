import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Bell, Mail, MoreHorizontal, PlusCircle, Save, Slack, Users } from 'lucide-react'
import { useState } from 'react'

// --- MOCK DATA ---
const mockData = {
  statuses: [
    { id: 'stat_1', name: 'To Do' },
    { id: 'stat_2', name: 'In Progress' },
    { id: 'stat_4', name: 'Done' },
  ],
  priorities: [
    { id: 'pri_1', name: 'Low' },
    { id: 'pri_2', name: 'Medium' },
    { id: 'pri_3', name: 'High' },
  ],
  severities: [
    { id: 'sev_1', name: 'Minor' },
    { id: 'sev_2', name: 'Major' },
    { id: 'sev_3', name: 'Blocker' },
  ],
  types: [
    { id: 'type_1', name: 'Bug' },
    { id: 'type_2', name: 'Feature Request' },
    { id: 'type_3', name: 'Task' },
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
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState('statuses')
  const [itemName, setItemName] = useState('')

  const activeConfig = configTabs.find((tab) => tab.value === activeTab)

  const handleCreateClick = () => {
    setEditingItem(null)
    setItemName('')
    setIsItemDialogOpen(true)
  }
  const handleEditClick = (item) => {
    setEditingItem(item)
    setItemName(item.name)
    setIsItemDialogOpen(true)
  }
  const handleDeleteClick = (item) => setItemToDelete(item)
  const confirmDelete = () => {
    console.log(`Deleting ${activeConfig.label}: ${itemToDelete?.name}`)
    setItemToDelete(null)
  }
  const handleItemSubmit = (event) => {
    event.preventDefault()
    console.log(`Saving ${activeConfig.label}:`, { id: editingItem?.id, name: itemName })
    setIsItemDialogOpen(false)
  }

  return (
    <div className="min-h-screen flex-1 space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Configurations</h1>
        <p className="text-muted-foreground">
          Manage customizable options and system settings for your bug tracking tool.
        </p>
      </div>

      <Tabs defaultValue="statuses" className="space-y-4">
        <TabsList>
          {configTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* --- Item Management Tabs (Statuses, Priorities, etc.) --- */}
        {configTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} onFocus={() => setActiveTab(tab.value)}>
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
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tab.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleEditClick(item)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={() => handleDeleteClick(item)}
                              >
                                Delete
                              </DropdownMenuItem>
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

        {/* --- System Settings Tab --- */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Manage global system configurations and third-party integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {/* 1. Email SMTP Config */}
                <AccordionItem value="smtp">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" /> Email (SMTP) Configuration
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-host">SMTP Host</Label>
                          <Input id="smtp-host" placeholder="smtp.example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-port">SMTP Port</Label>
                          <Input id="smtp-port" type="number" placeholder="587" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-user">Username</Label>
                          <Input id="smtp-user" placeholder="user@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-pass">Password</Label>
                          <Input id="smtp-pass" type="password" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">Last saved 5 minutes ago</p>
                        <div>
                          <Button variant="outline" type="button" className="mr-2">
                            Test Connection
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Save SMTP Settings
                          </Button>
                        </div>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>

                {/* 2. Slack Integration */}
                <AccordionItem value="slack">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Slack className="h-5 w-5" /> Slack Integration
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="slack-webhook">Webhook URL</Label>
                        <Input
                          id="slack-webhook"
                          placeholder="https://hooks.slack.com/services/..."
                        />
                        <p className="text-muted-foreground text-xs">
                          Enter the incoming webhook URL from your Slack app configuration.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">Not configured</p>
                        <div>
                          <Button variant="outline" type="button" className="mr-2">
                            Send Test Notification
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Save Slack Settings
                          </Button>
                        </div>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>

                {/* 3. Teams Integration */}
                <AccordionItem value="teams">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" /> Microsoft Teams Integration
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="teams-webhook">Webhook URL</Label>
                        <Input
                          id="teams-webhook"
                          placeholder="https://yourtenant.webhook.office.com/..."
                        />
                        <p className="text-muted-foreground text-xs">
                          Enter the incoming webhook URL from your Teams channel configuration.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">Not configured</p>
                        <div>
                          <Button variant="outline" type="button" className="mr-2">
                            Send Test Notification
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Save Teams Settings
                          </Button>
                        </div>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>

                {/* 4. Notification Settings */}
                <AccordionItem value="notifications">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5" /> Default Notification Method
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label>Default Method</Label>
                        <Select defaultValue="email">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a default notification method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="slack-dm">Slack DM</SelectItem>
                            <SelectItem value="slack-group">Slack Channel</SelectItem>
                            <SelectItem value="teams-dm">Microsoft Teams DM</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-muted-foreground text-xs">
                          This is the default notification method for new users. Users can override
                          this in their personal settings.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">Last saved 1 hour ago</p>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Save Notification Settings
                        </Button>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for Creating/Editing Items (Statuses, Priorities, etc.) */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleItemSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit' : 'Create'} {activeConfig?.label.slice(0, -1)}
              </DialogTitle>
              <DialogDescription>
                Enter the name for the {activeConfig?.label.toLowerCase().slice(0, -1)}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for Deleting Items */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the item{' '}
              <span className="font-bold">"{itemToDelete?.name}"</span>. This action cannot be
              undone.
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
