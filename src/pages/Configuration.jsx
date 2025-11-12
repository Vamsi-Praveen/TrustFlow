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
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { timeAgo } from '@/helpers/TimeConversion'
import useAxios from '@/hooks/useAxios'
import {
  Bell,
  Loader,
  Loader2,
  Mail,
  MoreHorizontal,
  PlusCircle,
  Save,
  Slack,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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

  const [config, setConfig] = useState({
    smtpConfig: {
      host: '',
      port: 465,
      enableSsl: true,
      userName: '',
      password: '',
      fromEmail: '',
      displayName: '',
      senderName: '',
    },
    teamsConfig: {
      tenantId: '',
      clientSecret: '',
      clientId: '',
      scope: '',
      grantType: '',
      tokenUrl: '',
    },
    slackConfig: {
      slackWebhookURL: '',
      slackAppName: '',
      slackChannelName: '',
      slackBotToken: '',
      slackBotName: '',
      slackBaseAddress: '',
    },
    portalConfig: {
      defaultNotificationMethod: '',
    },
  })

  const [configStatus, setConfigStatus] = useState({
    smtp: false,
    slack: false,
    teams: false,
    portal: null,
  })

  const [configDirty, setConfigDirty] = useState({
    smtp: false,
    slack: false,
    teams: false,
    portal: false,
  })

  const [originalConfig, setOriginalConfig] = useState({
    smtpConfig: {},
    slackConfig: {},
    teamsConfig: {},
    portalConfig: {},
  })

  const [configLoading, setConfigLoading] = useState({
    smtp: false,
    slack: false,
    teams: false,
    portal: false,
  })
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

  const API = useAxios()

  const fetchSystemSettings = async () => {
    try {
      const res = await API.get('/systemsettings')
      if (res?.data?.success && res?.data?.data) {
        const smtpConfig = res.data.data.smtpConfig
        const teamsConfig = res.data.data.teamsConfig
        const slackConfig = res.data.data.slackConfig
        const portalConfig = res.data.data.portalConfig

        setConfigStatus({
          smtp: !!smtpConfig,
          teams: !!teamsConfig,
          slack: !!slackConfig,
          portal: portalConfig,
        })

        setConfig({
          smtpConfig: {
            displayName: smtpConfig?.displayName || '',
            enableSsl: smtpConfig?.enableSsl ?? true,
            host: smtpConfig?.host || '',
            port: smtpConfig?.port || '',
            userName: smtpConfig?.userName || '',
            password: smtpConfig?.password || '',
            fromEmail: smtpConfig?.fromEmail || '',
            senderName: smtpConfig?.senderName || '',
            updatedAt: smtpConfig?.updatedAt,
          },
          teamsConfig: {
            tenantId: teamsConfig?.tenantId || '',
            clientSecret: teamsConfig?.clientSecret || '',
            clientId: teamsConfig?.clientId || '',
            scope: teamsConfig?.scope || '',
            grantType: teamsConfig?.grantType || '',
            tokenUrl: teamsConfig?.tokenUrl || '',
            updatedAt: teamsConfig?.updatedAt,
          },
          slackConfig: {
            slackWebhookURL: slackConfig?.slackWebhookURL || '',
            slackAppName: slackConfig?.slackAppName || '',
            slackChannelName: slackConfig?.slackChannelName || '',
            slackBotToken: slackConfig?.slackBotToken || '',
            slackBotName: slackConfig?.slackBotName || '',
            slackBaseAddress: slackConfig?.slackBaseAddress || '',
            updatedAt: slackConfig?.updatedAt,
          },
          portalConfig: {
            defaultNotificationMethod: portalConfig?.defaultNotificationMethod || '',
            updatedAt: portalConfig?.updatedAt,
          },
        })
        setOriginalConfig({
          smtpConfig: {
            displayName: smtpConfig?.displayName || '',
            enableSsl: smtpConfig?.enableSsl ?? true,
            host: smtpConfig?.host || '',
            port: smtpConfig?.port || '',
            userName: smtpConfig?.userName || '',
            password: smtpConfig?.password || '',
            fromEmail: smtpConfig?.fromEmail || '',
            senderName: smtpConfig?.senderName || '',
          },
          teamsConfig: {
            tenantId: teamsConfig?.tenantId || '',
            clientSecret: teamsConfig?.clientSecret || '',
            clientId: teamsConfig?.clientId || '',
            scope: teamsConfig?.scope || '',
            grantType: teamsConfig?.grantType || '',
            tokenUrl: teamsConfig?.tokenUrl || '',
          },
          slackConfig: {
            slackWebhookURL: slackConfig?.slackWebhookURL || '',
            slackAppName: slackConfig?.slackAppName || '',
            slackChannelName: slackConfig?.slackChannelName || '',
            slackBotToken: slackConfig?.slackBotToken || '',
            slackBotName: slackConfig?.slackBotName || '',
            slackBaseAddress: slackConfig?.slackBaseAddress || '',
          },
          portalConfig: {
            defaultNotificationMethod: portalConfig?.defaultNotificationMethod || '',
          },
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to load system settings')
    }
  }

  useEffect(() => {
    fetchSystemSettings()
  }, [])

  const updateConfigFields = (key, item, value) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [item]: value,
        },
      }

      const isEqual = JSON.stringify(updated[key]) === JSON.stringify(originalConfig[key])
      setConfigDirty((prevDirty) => ({
        ...prevDirty,
        [key.replace('Config', '')]: !isEqual,
      }))

      return updated
    })
  }

  const testSmtp = async () => {
    setConfigLoading((prev) => ({
      ...prev,
      smtp: true,
    }))
    try {
      const res = await API.get('/email/test-smtp')
      if (res?.data?.success) {
        toast.success(res?.data?.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setConfigLoading((prev) => ({
        ...prev,
        smtp: false,
      }))
    }
  }

  const handleSaveSMTP = async (e) => {
    e.preventDefault()
    setConfigLoading((prev) => ({ ...prev, smtp: true }))
    try {
      const res = await API.put('/systemsettings/update-smtp', config.smtpConfig)
      if (res?.data?.success) {
        toast.success('SMTP settings saved successfully!')
        const now = new Date().toISOString()

        setOriginalConfig((prev) => ({
          ...prev,
          smtpConfig: { ...config.smtpConfig },
        }))
        setConfig((prev) => ({
          ...prev,
          smtpConfig: { ...prev.smtpConfig, updatedAt: now },
        }))
        setConfigDirty((prev) => ({ ...prev, smtp: false }))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save SMTP settings')
    } finally {
      setConfigLoading((prev) => ({ ...prev, smtp: false }))
    }
  }

  const handleSaveSlack = async (e) => {
    e.preventDefault()
    setConfigLoading((prev) => ({ ...prev, slack: true }))
    try {
      const res = await API.put('/systemsettings/update-slack', config.slackConfig)
      if (res?.data?.success) {
        toast.success('Slack settings saved successfully!')

        const now = new Date().toISOString()

        setOriginalConfig((prev) => ({
          ...prev,
          slackConfig: { ...config.slackConfig },
        }))
        setConfig((prev) => ({
          ...prev,
          slackConfig: { ...prev.slackConfig, updatedAt: now },
        }))
        setConfigDirty((prev) => ({ ...prev, slack: false }))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save Slack settings')
    } finally {
      setConfigLoading((prev) => ({ ...prev, slack: false }))
    }
  }

  const handleSaveTeams = async (e) => {
    e.preventDefault()
    setConfigLoading((prev) => ({ ...prev, teams: true }))
    try {
      const res = await API.put('/systemsettings/update-teams', config.teamsConfig)
      if (res?.data?.success) {
        toast.success('Microsoft Teams settings saved successfully!')
        setOriginalConfig((prev) => ({
          ...prev,
          teamsConfig: { ...config.teamsConfig },
        }))
        setConfig((prev) => ({
          ...prev,
          teamsConfig: { ...prev.teamsConfig, updatedAt: now },
        }))
        setConfigDirty((prev) => ({ ...prev, teams: false }))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save Teams settings')
    } finally {
      setConfigLoading((prev) => ({ ...prev, teams: false }))
    }
  }

  const handleSavePortal = async (e) => {
    e.preventDefault()
    setConfigLoading((prev) => ({ ...prev, portal: true }))
    try {
      const res = await API.put('/systemsettings/update-config', config.portalConfig)
      if (res?.data?.success) {
        toast.success('Default notification method saved!')
        const now = new Date().toISOString()

        setOriginalConfig((prev) => ({
          ...prev,
          portalConfig: { ...config.portalConfig },
        }))
        setConfig((prev) => ({
          ...prev,
          portalConfig: { ...prev.portalConfig, updatedAt: now },
        }))
        setConfigDirty((prev) => ({ ...prev, portal: false }))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save portal settings')
    } finally {
      setConfigLoading((prev) => ({ ...prev, portal: false }))
    }
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
                <AccordionItem value="smtp">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" /> Email (SMTP) Configuration{' '}
                      {!configStatus?.smtp && <Badge variant="outline">Not Configured </Badge>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-6" onSubmit={handleSaveSMTP}>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-host">SMTP Host</Label>
                          <Input
                            id="smtp-host"
                            placeholder="smtp.example.com"
                            value={config?.smtpConfig?.host}
                            onChange={(e) =>
                              updateConfigFields('smtpConfig', 'host', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-port">SMTP Port</Label>
                          <Input
                            id="smtp-port"
                            type="number"
                            placeholder="587"
                            value={config?.smtpConfig?.port}
                            onChange={(e) =>
                              updateConfigFields('smtpConfig', 'port', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-user">Username</Label>
                          <Input
                            id="smtp-user"
                            placeholder="user@example.com"
                            value={config?.smtpConfig?.userName}
                            onChange={(e) =>
                              updateConfigFields('smtpConfig', 'userName', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-pass">Password</Label>
                          <Input
                            id="smtp-pass"
                            type="password"
                            value={config?.smtpConfig?.password}
                            onChange={(e) =>
                              updateConfigFields('smtpConfig', 'password', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-senderName">Sender Name</Label>
                          <Input
                            id="smtp-senderName"
                            type="text"
                            placeholder="John Doe"
                            value={config?.smtpConfig?.senderName}
                            onChange={(e) =>
                              updateConfigFields('smtpConfig', 'senderName', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-fromEmail">From Email</Label>
                          <Input
                            id="smtp-fromEmail"
                            type="email"
                            placeholder="user@example.com"
                            value={config?.smtpConfig?.fromEmail}
                            onChange={(e) =>
                              updateConfigFields('smtpConfig', 'fromEmail', e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">
                          Last saved {timeAgo(config?.smtpConfig?.updatedAt)}
                        </p>
                        <div>
                          <Button
                            variant="outline"
                            type="button"
                            className="mr-2"
                            onClick={testSmtp}
                            disabled={configLoading?.smtp}
                          >
                            {configLoading?.smtp ? (
                              <div className="flex items-center gap-2">
                                <Loader className="mr-2 h-5 w-5 animate-spin" />
                                <span>Testing</span>
                              </div>
                            ) : (
                              'Test Connection'
                            )}
                          </Button>
                          <Button type="submit" disabled={!configDirty.smtp || configLoading.smtp}>
                            {configLoading.smtp ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save SMTP Settings
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="slack">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Slack className="h-5 w-5" /> Slack Integration{' '}
                      {!configStatus?.slack && <Badge variant="outline">Not Configured</Badge>}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-6" onSubmit={handleSaveSlack}>
                      <div>
                        <h4 className="mb-4 ml-1 text-sm font-semibold">Group Notifications</h4>
                        <div className="grid grid-cols-1 gap-4 rounded-sm border p-5 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="slack-webhook">Webhook URL</Label>
                            <Input
                              id="slack-webhook"
                              placeholder="https://hooks.slack.com/services/..."
                              value={config.slackConfig.slackWebhookURL}
                              onChange={(e) =>
                                updateConfigFields('slackConfig', 'slackWebhookURL', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="slack-channel">Channel Name</Label>
                            <Input
                              id="slack-channel"
                              placeholder="#general"
                              value={config.slackConfig.slackChannelName}
                              onChange={(e) =>
                                updateConfigFields(
                                  'slackConfig',
                                  'slackChannelName',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-4 ml-1 text-xs">
                          Use this section to configure Slack group notifications for a specific
                          channel using a webhook.
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-4 ml-1 text-sm font-semibold">
                          Direct Message Notifications
                        </h4>
                        <div className="grid grid-cols-1 gap-6 rounded-sm border p-5 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="slack-app-name">Slack App Name</Label>
                            <Input
                              id="slack-app-name"
                              placeholder="TrustFlow Bot"
                              value={config.slackConfig.slackAppName}
                              onChange={(e) =>
                                updateConfigFields('slackConfig', 'slackAppName', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="slack-bot-token">Bot Token</Label>
                            <Input
                              id="slack-bot-token"
                              type="password"
                              placeholder="xoxb-..."
                              value={config.slackConfig.slackBotToken}
                              onChange={(e) =>
                                updateConfigFields('slackConfig', 'slackBotToken', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="slack-bot-name">Bot Name</Label>
                            <Input
                              id="slack-bot-name"
                              placeholder="TrustFlow Assistant"
                              value={config.slackConfig.slackBotName}
                              onChange={(e) =>
                                updateConfigFields('slackConfig', 'slackBotName', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="slack-base-address">Base Address</Label>
                            <Input
                              id="slack-base-address"
                              placeholder="https://slack.com/api/"
                              value={config.slackConfig.slackBaseAddress}
                              onChange={(e) =>
                                updateConfigFields(
                                  'slackConfig',
                                  'slackBaseAddress',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-4 ml-1 text-xs">
                          Configure your Slack bot credentials here to enable direct message
                          notifications for users.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-muted-foreground text-xs">
                          Last saved {timeAgo(config?.slackConfig?.updatedAt)}
                        </p>
                        <div>
                          <Button variant="outline" type="button" className="mr-2" disabled>
                            Send Test Notification
                          </Button>
                          <Button
                            type="submit"
                            disabled={!configDirty.slack || configLoading.slack}
                          >
                            {configLoading.slack ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Slack Settings
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="teams">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" /> Microsoft Teams Integration{' '}
                      {!configStatus?.teams && <Badge variant="outline">Not Configured</Badge>}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-6" onSubmit={handleSaveTeams}>
                      <div>
                        <h4 className="mb-4 ml-1 text-sm font-semibold">Channel Notifications</h4>
                        <div className="space-y-2 rounded-sm border p-5">
                          <Label htmlFor="teams-webhook">Webhook URL</Label>
                          <Input
                            id="teams-webhook"
                            placeholder="https://yourtenant.webhook.office.com/..."
                            value={config.teamsConfig.webhookUrl || ''}
                            onChange={(e) =>
                              updateConfigFields('teamsConfig', 'webhookUrl', e.target.value)
                            }
                          />
                          <p className="text-muted-foreground mt-2 text-xs">
                            Enter the incoming webhook URL for your Teams channel to receive project
                            updates.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-4 ml-1 text-sm font-semibold">OAuth App Configuration</h4>
                        <div className="grid grid-cols-1 gap-4 rounded-sm border p-5 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="teams-tenant-id">Tenant ID</Label>
                            <Input
                              id="teams-tenant-id"
                              placeholder="Your Tenant ID"
                              value={config.teamsConfig.tenantId}
                              onChange={(e) =>
                                updateConfigFields('teamsConfig', 'tenantId', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teams-client-id">Client ID</Label>
                            <Input
                              id="teams-client-id"
                              placeholder="Your Azure App Client ID"
                              value={config.teamsConfig.clientId}
                              onChange={(e) =>
                                updateConfigFields('teamsConfig', 'clientId', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teams-client-secret">Client Secret</Label>
                            <Input
                              id="teams-client-secret"
                              type="password"
                              placeholder="Your Azure App Client Secret"
                              value={config.teamsConfig.clientSecret}
                              onChange={(e) =>
                                updateConfigFields('teamsConfig', 'clientSecret', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teams-scope">Scope</Label>
                            <Input
                              id="teams-scope"
                              placeholder="https://graph.microsoft.com/.default"
                              value={config.teamsConfig.scope}
                              onChange={(e) =>
                                updateConfigFields('teamsConfig', 'scope', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teams-grant-type">Grant Type</Label>
                            <Input
                              id="teams-grant-type"
                              placeholder="client_credentials"
                              value={config.teamsConfig.grantType}
                              onChange={(e) =>
                                updateConfigFields('teamsConfig', 'grantType', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teams-token-url">Token URL</Label>
                            <Input
                              id="teams-token-url"
                              placeholder="https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token"
                              value={config.teamsConfig.tokenUrl}
                              onChange={(e) =>
                                updateConfigFields('teamsConfig', 'tokenUrl', e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-4 ml-1 text-xs">
                          Use these credentials for sending advanced notifications via Microsoft
                          Graph API or for user-specific Teams messages.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-muted-foreground text-xs">
                          Last updated {timeAgo(config?.teamsConfig?.updatedAt)}
                        </p>
                        <div>
                          <Button variant="outline" type="button" className="mr-2" disabled>
                            Send Test Notification
                          </Button>
                          <Button
                            type="submit"
                            disabled={!configDirty.teams || configLoading.teams}
                          >
                            {configLoading.teams ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Teams Settings
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notifications">
                  <AccordionTrigger className="text-md font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5" /> Default Notification Method{' '}
                      {!configStatus?.portal?.defaultNotificationMethod && (
                        <Badge variant="outline">Not Configured</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background rounded-b-md p-4">
                    <form className="space-y-4" onSubmit={handleSavePortal}>
                      <div className="flex gap-2">
                        <Label>Default Method</Label>
                        <Select
                          value={config?.portalConfig?.defaultNotificationMethod}
                          onValueChange={(value) => {
                            updateConfigFields('portalConfig', 'defaultNotificationMethod', value)
                          }}
                        >
                          <SelectTrigger className="min-w-48">
                            <SelectValue placeholder="Select a default notification method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="slack-dm">Slack DM</SelectItem>
                            <SelectItem value="slack-group">Slack Channel</SelectItem>
                            <SelectItem value="teams-dm">Microsoft Teams DM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        This is the default notification method for new users. Users can override
                        this in their personal settings.
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">
                          Last saved {timeAgo(config?.portalConfig?.updatedAt)}
                        </p>
                        <Button type="submit" disabled={!configDirty.portal}>
                          {configLoading.portal ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Notification Settings
                            </>
                          )}
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
