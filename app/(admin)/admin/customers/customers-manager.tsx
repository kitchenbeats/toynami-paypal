'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, Users, UserCheck, UserX, Shield, 
  Calendar, Mail, Phone
} from 'lucide-react'
import { toast } from 'sonner'

interface Customer {
  id: string
  email: string
  full_name?: string
  phone?: string
  is_admin: boolean
  created_at: string
  updated_at?: string
  last_sign_in_at?: string
  email_confirmed_at?: string
}

interface CustomersManagerProps {
  initialCustomers: Customer[]
}

export function CustomersManager({ initialCustomers }: CustomersManagerProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Filter customers based on search and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'verified' && customer.email_confirmed_at) ||
      (filterStatus === 'unverified' && !customer.email_confirmed_at) ||
      (filterStatus === 'admin' && customer.is_admin) ||
      (filterStatus === 'customer' && !customer.is_admin)
    
    return matchesSearch && matchesStatus
  })

  const handleToggleAdmin = async (customerId: string, currentAdminStatus: boolean) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentAdminStatus })
        .eq('id', customerId)

      if (error) throw error

      setCustomers(customers.map(c => 
        c.id === customerId ? { ...c, is_admin: !currentAdminStatus } : c
      ))
      
      toast.success(`Customer ${!currentAdminStatus ? 'promoted to' : 'removed from'} admin`)
    } catch (error) {
      console.error('Error updating customer:', error)
      toast.error('Failed to update customer')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (customer: Customer) => {
    if (customer.is_admin) {
      return <Badge variant="default"><Shield className="h-3 w-3 mr-1" />Admin</Badge>
    }
    if (customer.email_confirmed_at) {
      return <Badge variant="outline"><UserCheck className="h-3 w-3 mr-1" />Verified</Badge>
    }
    return <Badge variant="secondary"><UserX className="h-3 w-3 mr-1" />Unverified</Badge>
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const getCustomerStats = () => {
    return {
      total: customers.length,
      verified: customers.filter(c => c.email_confirmed_at).length,
      unverified: customers.filter(c => !c.email_confirmed_at).length,
      admins: customers.filter(c => c.is_admin).length
    }
  }

  const stats = getCustomerStats()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Unverified</p>
                <p className="text-2xl font-bold">{stats.unverified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="customer">Customers Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {customer.full_name || 'Unnamed Customer'}
                    </h3>
                    {getStatusBadge(customer)}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(customer.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Last login {formatDate(customer.last_sign_in_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAdmin(customer.id, customer.is_admin)}
                    disabled={loading}
                  >
                    {customer.is_admin ? (
                      <>
                        <UserX className="h-4 w-4 mr-1" />
                        Remove Admin
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-1" />
                        Make Admin
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No customers found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Customers will appear here when they sign up'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}