import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const tabs = [
  {
    id: 'general',
    label: 'General',
    description: 'Manage general application settings',
    content: <GeneralSettings />
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Configure email settings',
    content: <EmailSettings />
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Manage third-party integrations',
    content: <IntegrationsSettings />
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Advanced system settings',
    content: <AdvancedSettings />
  }
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage system settings and configurations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button>Save Changes</Button>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">{tab.label}</h2>
              <p className="text-sm text-gray-500">{tab.description}</p>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              {tab.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Example settings components - you can expand these as needed
function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base font-medium">Site Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">
              Site Name
            </label>
            <input
              type="text"
              name="site-name"
              id="site-name"
              defaultValue="Venture Link"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="site-description" className="block text-sm font-medium text-gray-700">
              Site Description
            </label>
            <input
              type="text"
              name="site-description"
              id="site-description"
              defaultValue="Connect with startups and investors"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Registration</h3>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="allow-registration"
              name="allow-registration"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="allow-registration" className="font-medium text-gray-700">
              Allow new user registration
            </label>
            <p className="text-gray-500">When disabled, only administrators can create new user accounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base font-medium">Email Server</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="smtp-host" className="block text-sm font-medium text-gray-700">
              SMTP Host
            </label>
            <input
              type="text"
              name="smtp-host"
              id="smtp-host"
              defaultValue="smtp.brevo.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700">
              SMTP Port
            </label>
            <input
              type="number"
              name="smtp-port"
              id="smtp-port"
              defaultValue="587"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="smtp-username" className="block text-sm font-medium text-gray-700">
              SMTP Username
            </label>
            <input
              type="text"
              name="smtp-username"
              id="smtp-username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="smtp-password" className="block text-sm font-medium text-gray-700">
              SMTP Password
            </label>
            <input
              type="password"
              name="smtp-password"
              id="smtp-password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Email Templates</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Customize the email templates used for various system notifications.
          </p>
          <Button variant="outline">Manage Email Templates</Button>
        </div>
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base font-medium">Google Analytics</h3>
        <div className="space-y-2">
          <label htmlFor="ga-tracking-id" className="block text-sm font-medium text-gray-700">
            Google Analytics Tracking ID
          </label>
          <input
            type="text"
            name="ga-tracking-id"
            id="ga-tracking-id"
            placeholder="UA-XXXXXXXXX-X"
            className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500">
            Leave blank to disable Google Analytics tracking.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Google reCAPTCHA</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="recaptcha-site-key" className="block text-sm font-medium text-gray-700">
                Site Key
              </label>
              <input
                type="text"
                name="recaptcha-site-key"
                id="recaptcha-site-key"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="recaptcha-secret-key" className="block text-sm font-medium text-gray-700">
                Secret Key
              </label>
              <input
                type="password"
                name="recaptcha-secret-key"
                id="recaptcha-secret-key"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="enable-recaptcha"
                name="enable-recaptcha"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enable-recaptcha" className="font-medium text-gray-700">
                Enable reCAPTCHA
              </label>
              <p className="text-gray-500">Enable this to add reCAPTCHA to forms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvancedSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base font-medium">Maintenance Mode</h3>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="maintenance-mode"
              name="maintenance-mode"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="maintenance-mode" className="font-medium text-gray-700">
              Enable Maintenance Mode
            </label>
            <p className="text-gray-500">
              When enabled, only administrators will be able to access the site. All other users will see a maintenance page.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Cache</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Clear all cached data. This may improve performance if you're experiencing issues.
          </p>
          <Button variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
            Clear Cache
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Backup & Restore</h3>
        <div className="space-y-4">
          <div>
            <Button variant="outline" className="mr-2">
              Create Backup
            </Button>
            <Button variant="outline">
              Restore from Backup
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Create a backup of your current database and media files.
          </p>
        </div>
      </div>
    </div>
  );
}
