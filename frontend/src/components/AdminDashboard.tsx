import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Users, Activity, Search, Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useAccount } from 'wagmi';
import { hexToString, stringToBytes, toBytes, encodePacked, keccak256, encodeAbiParameters, parseAbiParameters, toHex } from 'viem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { supplyChainContractAbi } from '../constants/SupplyChainAbi';

interface AdminDashboardProps {
  onBack: () => void;
}

const supplyChainContractAddress = '0xDb768D6B85C0A6E67D97c5b5dC6f15CccCdc888c' as const;

const roleMapping: { [key: number]: string } = {
  0: 'norole',
  1: 'supplier',
  2: 'transporter',
  3: 'manufacturer',
  4: 'wholesaler',
  5: 'distributor',
  6: 'pharma',
  7: 'revoke',
};

const roleStringToUint256: { [key: string]: number } = {
  'supplier': 1,
  'transporter': 2,
  'manufacturer': 3,
  'wholesaler': 4,
  'distributor': 5,
  'pharma': 6,
};

interface User {
  address: string;
  name: string;
  location: string;
  role: string;
  status: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showReassignRole, setShowReassignRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    address: '',
    name: '',
    location: '',
    role: ''
  });
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const client = usePublicClient();
  const { address: account, chain } = useAccount();

  const { data: usersCount, isLoading: isUsersCountLoading, refetch: refetchUsersCount } = useReadContract({
    address: supplyChainContractAddress,
    abi: supplyChainContractAbi,
    functionName: 'getUsersCount',
  });

  const { writeContract, data: writeData, error: writeError, isPending: isWritePending } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        setTxHash(data);
      },
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed) {
      console.log('Transaction confirmed!');
      setNewUser({ address: '', name: '', location: '', role: '' });
      setShowCreateUser(false);
      setShowReassignRole(false);
      refetchUsersCount();
    }
    if (confirmError) {
      console.error('Transaction confirmation error:', confirmError);
      alert('Transaction failed: ' + confirmError.message);
    }
  }, [isConfirmed, confirmError, refetchUsersCount]);

  useEffect(() => {
    if (writeError) {
      console.error('Write error:', writeError);
      alert('Failed to submit transaction: ' + writeError.message);
    }
  }, [writeError]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (usersCount !== undefined && client) {
        const fetchedUsers: User[] = [];
        for (let i = 0; i < Number(usersCount); i++) {
          try {
            const userData = await client.readContract({
              address: supplyChainContractAddress,
              abi: supplyChainContractAbi,
              functionName: 'getUserbyIndex',
              args: [BigInt(i)],
            }) as [string, string, string, number];

            if (userData) {
              const [nameBytes, locationBytes, ethAddress, roleUint8] = userData;
              const roleString = mapContractRoleToFrontendRole(roleUint8);

              fetchedUsers.push({
                address: ethAddress,
                name: hexToString(nameBytes as `0x${string}`, { size: 32 }),
                location: hexToString(locationBytes as `0x${string}`, { size: 32 }),
                role: roleString,
                status: roleUint8 !== 7 ? 'Active' : 'Revoked',
              });
            }
          } catch (error) {
            console.error(`Error fetching user at index ${i}:`, error);
          }
        }
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      }
    };

    fetchUsers();
  }, [usersCount, client]);

  useEffect(() => {
    let filtered = [...users];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.address.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query)
      );
    }
    
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, statusFilter, users]);

  const mapContractRoleToFrontendRole = (contractRoleUint8: number): string => {
    return roleMapping[contractRoleUint8] || 'Unknown';
  };

  const handleCreateUser = async () => {
    if (!account || !chain) {
      alert('Please connect your wallet first');
      return;
    }

    if (!newUser.address || !newUser.name || !newUser.location || !newUser.role) {
      alert('Please fill in all fields');
      return;
    }

    const roleUint = roleStringToUint256[newUser.role];
    if (roleUint === undefined) {
      alert('Invalid role selected');
      return;
    }

    try {
      // Convert strings to bytes32 as padded hex strings
      const nameBytes = toHex(newUser.name, { size: 32 });
      const locationBytes = toHex(newUser.location, { size: 32 });

      console.log('nameBytes:', nameBytes, 'Type:', typeof nameBytes);
      console.log('locationBytes:', locationBytes, 'Type:', typeof locationBytes);

      // Ensure address has 0x prefix
      const userAddress = newUser.address.startsWith('0x') ? newUser.address : `0x${newUser.address}`;

      console.log('Creating user with details:', {
        address: userAddress,
        name: newUser.name,
        location: newUser.location,
        role: roleUint,
        nameBytes,
        locationBytes
      });

      writeContract({
        chain,
        account,
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'registerUser',
        args: [
          userAddress as `0x${string}`,
          nameBytes as `0x${string}`,
          locationBytes as `0x${string}`,
          BigInt(roleUint)
        ],
      });

      console.log('Write contract called, waiting for transaction...');

    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleReassignRole = async (user: User, newRole: string) => {
    const roleUint = roleStringToUint256[newRole];
    if (roleUint === undefined) {
      alert('Invalid role selected');
      return;
    }

    try {
      writeContract({
        chain,
        account,
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'reassigneRole',
        args: [user.address as `0x${string}`, BigInt(roleUint)],
      });
    } catch (error) {
      console.error('Error reassigning role:', error);
      alert('Failed to reassign role. See console for details.');
    }
  };

  const handleRevokeRole = async (user: User) => {
    try {
      writeContract({
        chain,
        account,
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'revokeRole',
        args: [user.address as `0x${string}`],
      });
    } catch (error) {
      console.error('Error revoking role:', error);
      alert('Failed to revoke role. See console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage users and system overview</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateUser(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create User</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isUsersCountLoading ? 'Loading...' : Number(usersCount)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.entries(roleStringToUint256).map(([role, _]) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isUsersCountLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.address}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell className="font-mono text-sm">{user.address}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'revoke' ? 'destructive' : 'default'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowReassignRole(true);
                            }}
                            disabled={isWritePending}
                          >
                            Reassign Role
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeRole(user)}
                            disabled={isWritePending || user.status === 'Revoked'}
                          >
                            Revoke
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Register a new user in the supply chain system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input
                  id="address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  placeholder="0x..."
                  disabled={isWritePending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter name"
                  disabled={isWritePending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newUser.location}
                  onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                  placeholder="Enter location"
                  disabled={isWritePending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  disabled={isWritePending || isConfirming}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="transporter">Transporter</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="pharma">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateUser(false)}
                disabled={isWritePending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateUser} 
                disabled={isWritePending || !newUser.address || !newUser.name || !newUser.location || !newUser.role}
              >
                {isWritePending ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reassign Role Dialog */}
        <Dialog open={showReassignRole} onOpenChange={setShowReassignRole}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reassign Role</DialogTitle>
              <DialogDescription>
                Change the role for user: {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="newRole">New Role</Label>
                <Select
                  onValueChange={(value) => {
                    if (selectedUser) {
                      handleReassignRole(selectedUser, value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="transporter">Transporter</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="pharma">Pharmacy</SelectItem>
                    <SelectItem value="revoke">Revoke Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReassignRole(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};


