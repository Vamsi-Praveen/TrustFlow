import { Calendar, Edit, Loader2, MessageSquare, MoreVertical, Paperclip } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
import { timeAgo } from '@/helpers/TimeConversion'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// --- MOCK DATA ---
const mockUsers = [
  { id: 'usr_1', name: 'Liam Johnson', initial: 'LJ', avatarUrl: '/avatars/01.png' },
  { id: 'usr_2', name: 'Olivia Smith', initial: 'OS', avatarUrl: '/avatars/02.png' },
  { id: 'usr_3', name: 'Noah Williams', initial: 'NW', avatarUrl: '/avatars/03.png' },
]

const mockIssueData = {
  id: 'BUG-8782',
  title: 'Button component overflows on mobile view in settings',
  description: `### Steps to Reproduce
1. Navigate to the **/settings** page on a mobile viewport (e.g., Chrome DevTools iPhone X).
2. Observe the "Save Profile" button.

### Expected Behavior
The button should stay within the card's boundaries and not cause horizontal overflow.

### Actual Behavior
The button overflows its container, causing a horizontal scrollbar to appear on the page. This seems to be caused by inflexible padding on the parent form container.

See attached screenshot for reference.`,
  status: 'In Progress',
  priority: 'High',
  severity: 'Major',
  type: 'Bug',
  reporter: mockUsers[1],
  assignee: mockUsers[0],
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  attachments: [
    { name: 'mobile-overflow-screenshot.png', size: '128 KB' },
    { name: 'console-logs.txt', size: '12 KB' },
  ],
  comments: [
    {
      user: mockUsers[0],
      text: "I can reproduce this. I'll start looking into the CSS.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  activity: [
    {
      user: mockUsers[0],
      action: 'commented',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      user: mockUsers[1],
      action: 'changed status from To Do to In Progress',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      user: mockUsers[1],
      action: 'assigned this issue to Liam Johnson',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      user: mockUsers[1],
      action: 'created this issue',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}
// --- END MOCK DATA ---

const getPriorityBadgeVariant = (priority) => {
  /* ... */
}

const IssueDetails = () => {
  const { user } = useAuth() || { user: mockUsers[2] }
  const [issue, setIssue] = useState(mockIssueData) // Main state for issue data

  // --- State for the Edit Dialog ---
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedTitle, setEditedTitle] = useState(issue.title)
  const [editedDescription, setEditedDescription] = useState(issue.description)

  // In a real app, you'd use a markdown renderer like 'react-markdown'
  const renderMarkdown = (text) => (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{
        __html: text.replace(/\n/g, '<br />').replace(/### (.*)/g, '<h3>$1</h3>'),
      }}
    />
  )

  const handleSaveChanges = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    console.log('Saving changes:', { title: editedTitle, description: editedDescription })
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the main issue state with the new data
    setIssue((prev) => ({
      ...prev,
      title: editedTitle,
      description: editedDescription,
      updatedAt: new Date().toISOString(),
    }))

    setIsSaving(false)
    setIsEditDialogOpen(false)
    toast.success('Issue updated successfully!')
  }

  const handleOpenChange = (open) => {
    if (open) {
      setEditedTitle(issue.title)
      setEditedDescription(issue.description)
    }
    setIsEditDialogOpen(open)
  }

  return (
    <div className="bg-muted/30 min-h-screen flex-1 space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{issue.id}</Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{issue.title}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isEditDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <form onSubmit={handleSaveChanges}>
                <DialogHeader>
                  <DialogTitle>Edit Issue</DialogTitle>
                  <DialogDescription>
                    Make changes to the issue title and description.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={12}
                      placeholder="Provide a detailed description..."
                    />
                    <p className="text-muted-foreground text-xs">
                      You can use Markdown for formatting.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save
                    Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>{renderMarkdown(issue.description)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attachments ({issue.attachments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issue.attachments.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{file.size}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Tabs defaultValue="comments" className="w-full">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activity">History</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.initial}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea placeholder="Add a comment..." />
                        <Button size="sm">Comment</Button>
                      </div>
                    </div>
                    {issue.comments.map((comment, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={comment.user.avatarUrl} />
                          <AvatarFallback>{comment.user.initial}</AvatarFallback>
                        </Avatar>
                        <div className="bg-background flex-1 rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{comment.user.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {timeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {issue.activity.map((act, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={act.user.avatarUrl} />
                          <AvatarFallback>{act.user.initial}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span className="font-semibold">{act.user.name}</span> {act.action}.
                          <div className="text-muted-foreground mt-1 text-xs">
                            {timeAgo(act.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Select defaultValue={issue.status}>
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Assignee</span>
                <Select defaultValue={issue.assignee.id}>
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reporter</span>
                <div className="flex items-center gap-2 font-medium">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={issue.reporter.avatarUrl} />
                    <AvatarFallback className="text-xs">{issue.reporter.initial}</AvatarFallback>
                  </Avatar>
                  {issue.reporter.name}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Priority</span>
                <Select defaultValue={issue.priority}>
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Severity</span>
                <span>{issue.severity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span>{issue.type}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{timeAgo(issue.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{timeAgo(issue.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default IssueDetails
