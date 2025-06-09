import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Truck, Package, MapPin, Clock } from 'lucide-react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useAccount } from 'wagmi';
import { toHex, stringToBytes, hexToString } from 'viem';
import { supplyChainContractAbi } from '../constants/SupplyChainAbi';
import { supplyChainContractAddress } from '../constants/contractAddress';

interface TransporterDashboardProps {
  onBack: () => void;
}

interface TransporterBatch {
  id: string;
  description: string;
  farmerName: string;
  farmLocation: string;
  quantity: string;
  status: string;
  shipperAddress: string;
  receiverAddress: string;
  date: string;
}

const rawMaterialAbi = [
  { "inputs": [], "name": "description", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "farmer_name", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "location", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "quantity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "status", "outputs": [{ "internalType": "enum RawMatrials.packageStatus", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "shipper", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "manufacturer", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
];

export const TransporterDashboard: React.FC<TransporterDashboardProps> = ({ onBack }) => {
  const [showPickupForm, setShowPickupForm] = useState(false);
  const [pickupBatchId, setPickupBatchId] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [pendingPickups, setPendingPickups] = useState<TransporterBatch[]>([]);
  const [inTransit, setInTransit] = useState<TransporterBatch[]>([]);
  const [completed, setCompleted] = useState<TransporterBatch[]>([]);

  const client = usePublicClient();
  const { address: account } = useAccount();

  // Fetch connected account's role
  const { data: userRole, isLoading: isUserRoleLoading, isError: isUserRoleError, error: userRoleError } = useReadContract({
    address: supplyChainContractAddress,
    abi: supplyChainContractAbi,
    functionName: 'getUserInfo',
    args: [account as `0x${string}`],
    query: {
      enabled: !!account, // Only fetch if an account is connected
      select: (data) => data[3], // The role is the 4th element (index 3) of the returned struct
    },
  });

  // Get total number of registered users
  const { data: usersCount, refetch: refetchUsersCount } = useReadContract({
    address: supplyChainContractAddress,
    abi: supplyChainContractAbi,
    functionName: 'getUsersCount',
    account: account,
  });

  useEffect(() => {
    if (userRole !== undefined) {
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
      const roleName = roleMapping[Number(userRole)];
      console.log("Connected wallet role:", roleName, "Address:", account);
      if (roleName !== 'transporter') {
        alert("You must be a registered Transporter to access this dashboard.");
      } else {
        refetchUsersCount(); // Start fetching user count once role is confirmed
      }
    }
    if (isUserRoleError) {
      console.error("Error fetching user role:", userRoleError);
    }
  }, [userRole, isUserRoleError, userRoleError, account, refetchUsersCount]);

  // Contract interaction hooks for loading consignment
  const { writeContract: writeLoadConsignment, data: loadConsignmentData, error: loadConsignmentError, isPending: isLoadConsignmentPending } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        setTxHash(data);
      },
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Effect to handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      console.log('Transaction confirmed!');
      setPickupBatchId('');
      setShowPickupForm(false);
      fetchTransporterBatches(); // Re-fetch batches after successful transaction
    }
    if (confirmError) {
      console.error('Transaction confirmation error:', confirmError);
      alert('Transaction failed: ' + confirmError.message);
    }
  }, [isConfirmed, confirmError]);

  const fetchTransporterBatches = async () => {
    console.log("Fetching transporter batches. Total users count:", usersCount, "Transporter address:", account);
    if (!usersCount || !account || userRole !== 2) { // Ensure transporter role (ID 2)
      console.log("Conditions not met for fetching transporter batches.");
      setPendingPickups([]);
      setInTransit([]);
      setCompleted([]);
      return;
    }

    const totalUsers = Number(usersCount);
    const newPendingPickups: TransporterBatch[] = [];
    const newInTransit: TransporterBatch[] = [];
    const newCompleted: TransporterBatch[] = [];

    let currentBatchId: `0x${string}` = "0x";
    let userDetails: [string, string, `0x${string}`, number] | undefined;

    for (let i = 0; i < totalUsers; i++) {
      try {
        userDetails = await client.readContract({
          address: supplyChainContractAddress,
          abi: supplyChainContractAbi,
          functionName: 'getUserbyIndex',
          args: [BigInt(i)],
          account: account,
        }) as [string, string, `0x${string}`, number];

        const userAddress = userDetails[2];
        const userRoleFromContract = userDetails[3];

        if (userRoleFromContract === 1) { // Check if the user is a supplier
          // Fetch packages created by this supplier
          const supplierPackagesCount = await client.readContract({
            address: supplyChainContractAddress,
            abi: supplyChainContractAbi,
            functionName: 'getPackagesCountS',
            account: userAddress as `0x${string}`,
          });

          const count = Number(supplierPackagesCount);
          for (let j = 0; j < count; j++) {
            const batchId = await client.readContract({
              address: supplyChainContractAddress,
              abi: supplyChainContractAbi,
              functionName: 'getPackageIdByIndexS',
              args: [BigInt(j)],
              account: userAddress as `0x${string}`,
            });
            currentBatchId = batchId as `0x${string}`;

            // Fetch details from the RawMatrials contract instance
            const [descriptionBytes, farmerNameBytes, locationBytes, quantityBigInt, statusUint8, shipperAddress, manufacturerAddress] = await Promise.all([
              client.readContract({ address: currentBatchId as `0x${string}`, abi: rawMaterialAbi, functionName: 'description', account: account }),
              client.readContract({ address: currentBatchId as `0x${string}`, abi: rawMaterialAbi, functionName: 'farmer_name', account: account }),
              client.readContract({ address: currentBatchId as `0x${string}`, abi: rawMaterialAbi, functionName: 'location', account: account }),
              client.readContract({ address: currentBatchId as `0x${string}`, abi: rawMaterialAbi, functionName: 'quantity', account: account }),
              client.readContract({ address: currentBatchId as `0x${string}`, abi: rawMaterialAbi, functionName: 'status', account: account }),
              client.readContract({ address: currentBatchId as `0x${string}`, abi: rawMaterialAbi, functionName: 'shipper', account: account }),
              client.readContract({ address: currentBatchId as `0x${string}`, abi: rawMaterialAbi, functionName: 'manufacturer', account: account }),
            ]) as [`0x${string}`, `0x${string}`, `0x${string}`, bigint, number, `0x${string}`, `0x${string}`];

            const description = hexToString(descriptionBytes, { size: 32 });
            const farmerName = hexToString(farmerNameBytes, { size: 32 });
            const farmLocation = hexToString(locationBytes, { size: 32 });
            const quantity = quantityBigInt.toString();

            const statusMapping: { [key: number]: string } = {
              0: 'At Creator',
              1: 'Picked',
              2: 'Delivered',
            };
            const status = statusMapping[Number(statusUint8)] || 'Unknown';
            const date = new Date().toISOString().split('T')[0]; // Placeholder for date

            // Only include batches relevant to this transporter (as shipper)
            if ((shipperAddress as string).toLowerCase() === account?.toLowerCase()) {
              const batch: TransporterBatch = {
                id: currentBatchId,
                description: description,
                farmerName: farmerName,
                farmLocation: farmLocation,
                quantity: quantity,
                status: status,
                shipperAddress: shipperAddress,
                receiverAddress: manufacturerAddress,
                date: date,
              };

              if (status === 'At Creator') {
                newPendingPickups.push(batch);
              } else if (status === 'Picked') {
                newInTransit.push(batch);
              } else if (status === 'Delivered') {
                newCompleted.push(batch);
              }
            }
          }
        }

      } catch (error) {
        console.error(`Error fetching user or batch details (user index: ${i}, batch: ${currentBatchId}):`, error);
      }
    }

    setPendingPickups(newPendingPickups);
    setInTransit(newInTransit);
    setCompleted(newCompleted);
  };

  // Effect to fetch batches when component mounts or relevant data changes
  useEffect(() => {
    fetchTransporterBatches();
  }, [usersCount, account, userRole]); // Removed client.chain here as it's not a dependency for fetchTransporterBatches

  const handlePickup = async () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }
    if (!pickupBatchId) {
      alert('Please enter a Batch ID.');
      return;
    }

    try {
      // Use transportertype 1 for raw materials
      await writeLoadConsignment({
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'loadConsingment',
        args: [
          pickupBatchId as `0x${string}`,
          BigInt(1), // transportertype 1 for raw materials
          '0x0000000000000000000000000000000000000000' as `0x${string}` // Placeholder for cid, not used for raw materials pick up
        ],
        account: account,
        chain: client.chain,
      });
      console.log('Load consignment transaction sent for:', pickupBatchId);
    } catch (error) {
      console.error('Error loading consignment:', error);
      alert('Failed to load consignment: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeliver = async (batchId: string) => {
    console.log(`Transporter confirms delivery for batch: ${batchId}`);
    
    // Re-fetch batches to ensure state is consistent with contract (after Manufacturer confirms)
    fetchTransporterBatches();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Picked': // In Transit
        return 'bg-blue-100 text-blue-800';
      case 'At Creator': // Pending Pickup
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transporter Dashboard</h1>
                <p className="text-sm text-gray-600">Manage batch transportation and logistics</p>
              </div>
            </div>
            <Button onClick={() => setShowPickupForm(true)} className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700" disabled={isLoadConsignmentPending || isConfirming}>
              <Package className="h-4 w-4" />
              <span>{isLoadConsignmentPending || isConfirming ? 'Processing...' : 'Pick & Load'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPickups.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting pickup</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inTransit.length}</div>
              <p className="text-xs text-muted-foreground">Currently moving</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Handled</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPickups.length + inTransit.length + completed.length}</div>
              <p className="text-xs text-muted-foreground">Batches managed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completed.length}</div>
              <p className="text-xs text-muted-foreground">Successfully completed transports</p>
            </CardContent>
          </Card>
        </div>

        {/* Pick & Load Form */}
        {showPickupForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pick & Load Batch</CardTitle>
              <CardDescription>Mark a batch as picked up and loaded for transport</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupBatchId">Batch ID (Address)</Label>
                <Input
                  id="pickupBatchId"
                  placeholder="Enter batch ID to pick up (e.g., 0x...)"
                  value={pickupBatchId}
                  onChange={(e) => setPickupBatchId(e.target.value)}
                  disabled={isLoadConsignmentPending || isConfirming}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPickupForm(false)} disabled={isLoadConsignmentPending || isConfirming}>
                  Cancel
                </Button>
                <Button onClick={handlePickup} className="bg-yellow-600 hover:bg-yellow-700" disabled={isLoadConsignmentPending || isConfirming}>
                  {isLoadConsignmentPending || isConfirming ? 'Processing...' : 'Confirm Pickup'}
                </Button>
              </div>
              {loadConsignmentError && (
                <div className="mt-2 text-sm text-red-600">
                  Error: {loadConsignmentError.message}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Pickups */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Pickups</CardTitle>
              <CardDescription>Batches ready for collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPickups.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No pending pickups.</div>
                ) : (
                  pendingPickups.map((batch, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div><strong>Product:</strong> {batch.description}</div>
                        <div><strong>From:</strong> {batch.farmerName} ({batch.farmLocation})</div>
                        <div><strong>To:</strong> {batch.receiverAddress}</div>
                        <div><strong>Quantity:</strong> {batch.quantity}</div>
                      </div>
                      <Button size="sm" className="mt-3 w-full bg-blue-500 hover:bg-blue-600" onClick={async () => {
                        if (!account) { alert('Please connect your wallet first.'); return; }
                        try {
                          await writeLoadConsignment({
                            address: supplyChainContractAddress,
                            abi: supplyChainContractAbi,
                            functionName: 'loadConsingment',
                            args: [
                              batch.id as `0x${string}`,
                              BigInt(1),
                              '0x0000000000000000000000000000000000000000' as `0x${string}`
                            ],
                            account: account,
                            chain: client.chain,
                          });
                          console.log('Load consignment transaction sent for:', batch.id);
                        } catch (error) {
                          console.error('Error loading consignment from batch card:', error);
                          alert('Failed to load consignment: ' + (error instanceof Error ? error.message : 'Unknown error'));
                        }
                      }} disabled={isLoadConsignmentPending || isConfirming}>
                        Pick Up
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* In Transit */}
          <Card>
            <CardHeader>
              <CardTitle>In Transit</CardTitle>
              <CardDescription>Currently being transported</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inTransit.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No batches in transit.</div>
                ) : (
                  inTransit.map((batch, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div><strong>Product:</strong> {batch.description}</div>
                        <div><strong>From:</strong> {batch.farmerName} ({batch.farmLocation})</div>
                        <div><strong>To:</strong> {batch.receiverAddress}</div>
                        <div><strong>Quantity:</strong> {batch.quantity}</div>
                      </div>
                      <Button size="sm" className="mt-3 w-full bg-green-500 hover:bg-green-600" onClick={() => handleDeliver(batch.id)} disabled={isLoadConsignmentPending || isConfirming}>
                        Mark as Delivered
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>Successfully completed transports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completed.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No completed deliveries.</div>
                ) : (
                  completed.map((batch, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div><strong>Product:</strong> {batch.description}</div>
                        <div><strong>From:</strong> {batch.farmerName} ({batch.farmLocation})</div>
                        <div><strong>To:</strong> {batch.receiverAddress}</div>
                        <div><strong>Quantity:</strong> {batch.quantity}</div>
                        <div><strong>Date:</strong> {batch.date}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};