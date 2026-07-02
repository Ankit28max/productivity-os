import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineMoon,
  HiOutlineBell,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiOutlineLogout,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: HiOutlineUser },
  { id: 'appearance', label: 'Appearance', icon: HiOutlineMoon },
  { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
  { id: 'security', label: 'Security', icon: HiOutlineLockClosed },
  { id: 'danger', label: 'Danger Zone', icon: HiOutlineTrash },
];

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    habitReminders: true,
    weeklyReport: true,
  });

  const handleSaveProfile = () => {
    updateProfile({ name, email });
    toast.success('Profile updated successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-0.5">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-primary-600/15 text-primary-400'
                      : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                  }`}
                >
                  <section.icon className="h-4.5 w-4.5" />
                  {section.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-6">Profile</h2>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-default">
                <Avatar name={user?.name} size="xl" />
                <div>
                  <p className="text-base font-medium text-text-primary">{user?.name}</p>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                  <Button variant="ghost" size="xs" className="mt-2">
                    Change Avatar
                  </Button>
                </div>
              </div>
              <div className="space-y-4 max-w-md">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={HiOutlineUser}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-6">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-900/50">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Dark Mode</p>
                    <p className="text-xs text-text-secondary mt-0.5">Use dark theme across the app</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-primary-600 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-900/50">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Compact Mode</p>
                    <p className="text-xs text-text-secondary mt-0.5">Reduce spacing for denser layouts</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-dark-700 relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-text-tertiary shadow-sm transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-6">Notifications</h2>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'taskReminders', label: 'Task Reminders', desc: 'Get reminded about upcoming tasks' },
                  { key: 'habitReminders', label: 'Habit Reminders', desc: 'Daily habit check-in reminders' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly productivity summary' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-surface-900/50">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                      }
                      className={`h-6 w-11 rounded-full relative transition-colors ${
                        notifications[item.key] ? 'bg-primary-600' : 'bg-dark-700'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full shadow-sm transition-all ${
                          notifications[item.key]
                            ? 'right-0.5 bg-white'
                            : 'left-0.5 bg-text-tertiary'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-6">Security</h2>
              <div className="space-y-4 max-w-md">
                <Input label="Current Password" type="password" placeholder="••••••••" icon={HiOutlineLockClosed} />
                <Input label="New Password" type="password" placeholder="••••••••" icon={HiOutlineLockClosed} />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" icon={HiOutlineLockClosed} />
                <Button onClick={() => toast.success('Password updated!')}>Update Password</Button>
              </div>
            </Card>
          )}

          {activeSection === 'danger' && (
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Danger Zone</h2>
              <p className="text-sm text-text-secondary mb-6">Irreversible actions</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-danger-500/20 bg-danger-500/5">
                  <div>
                    <p className="text-sm font-medium text-danger-400">Delete Account</p>
                    <p className="text-xs text-text-secondary mt-0.5">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="danger" size="sm" icon={HiOutlineTrash}>
                    Delete
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border-default">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Log out of all devices</p>
                    <p className="text-xs text-text-secondary mt-0.5">Sign out everywhere</p>
                  </div>
                  <Button variant="secondary" size="sm" icon={HiOutlineLogout} onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
