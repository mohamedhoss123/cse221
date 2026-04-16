import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/customer/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the user profile
    toast.success('Profile updated successfully')
    setIsEditing(false)
  }

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
          My Profile
        </h1>
        <p className="text-[var(--sea-ink-soft)]">
          Manage your account information
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="island-shell">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--lagoon-deep)]">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="pl-10"
                      placeholder="+1 234 567 8900"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="pl-10"
                      placeholder="123 Main St, City, Country"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button type="submit" className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-[var(--sea-ink-soft)]">
                      <span className="font-semibold">Account Type:</span>{' '}
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </p>
                    <p className="text-[var(--sea-ink-soft)]">
                      <span className="font-semibold">Member Since:</span>{' '}
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
