import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useAccount } from 'wagmi';
import { toHex, stringToBytes, hexToString } from 'viem';
import { supplyChainContractAbi } from '../constants/SupplyChainAbi';
import { supplyChainContractAddress } from '../constants/contractAddress';

interface SupplierDashboardProps {
  onBack: () => void;
}

interface Batch {
  id: string;
  product: string;
  farmer: string;
  location: string;
  quantity: string;
  status: string;
  date: string;
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ onBack }) => {
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [newBatch, setNewBatch] = useState({
    productId: '',
    description: '',
    farmerName: '',
    farmLocation: '',
    quantity: '',
    shipper: '',
    receiver: ''
  });
  const [batches, setBatches] = useState<Batch[]>([]);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const client = usePublicClient();
  const { address: account, chain } = useAccount();

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

  // Fetch supplier's batches count
  const { data: packagesCount, isLoading: isPackagesCountLoading, refetch: refetchPackagesCount, error: packagesCountError, isError: isPackagesCountError } = useReadContract({
    address: supplyChainContractAddress,
    abi: supplyChainContractAbi,
    functionName: 'getPackagesCountS',
    account: account,
    query: {
      enabled: userRole === 1,
    },
  });

  // Log the status of packagesCount fetch
  console.log("packagesCount status: data=", packagesCount, "isLoading=", isPackagesCountLoading, "isError=", isPackagesCountError, "error=", packagesCountError);

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
      // If the role is confirmed as supplier, explicitly refetch packages count
      if (roleName === 'supplier') {
        console.log("User role is supplier, re-fetching packagesCount...");
        refetchPackagesCount();
      }
    }
    if (isUserRoleError) {
      console.error("Error fetching user role:", userRoleError);
    }
  }, [userRole, isUserRoleError, userRoleError, refetchPackagesCount, account]);

  // Contract interaction hooks
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

  // Effect to handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      console.log('Batch creation confirmed!');
      setNewBatch({
        productId: '',
        description: '',
        farmerName: '',
        farmLocation: '',
        quantity: '',
        shipper: '',
        receiver: ''
      });
      setShowCreateBatch(false);
      // Refresh batches count and then list
      refetchPackagesCount();
    }
    if (confirmError) {
      console.error('Transaction confirmation error:', confirmError);
      alert('Transaction failed: ' + confirmError.message);
    }
  }, [isConfirmed, confirmError, refetchPackagesCount]);

  // Effect to fetch batches when component mounts or packagesCount changes
  useEffect(() => {
    console.log("useEffect for fetching batches triggered. Current packagesCount value:", packagesCount, "isPackagesCountError:", isPackagesCountError, "Current userRole:", userRole);
    if (isPackagesCountError) {
      console.error("Error fetching packagesCount:", packagesCountError);
    }
    // Only fetch batches if packagesCount is a valid BigInt AND userRole is supplier (role ID 1)
    if (typeof packagesCount === 'bigint' && packagesCount >= BigInt(0) && userRole === 1) {
      console.log("Calling fetchBatches with valid packagesCount and supplier role.");
      fetchBatches();
    } else if (packagesCount === undefined || packagesCount === null) {
      console.log("packagesCount is undefined or null, waiting for data to load.");
    }
  }, [packagesCount, client, isPackagesCountError, packagesCountError, userRole]); // Add userRole to dependencies

  // Function to fetch supplier's batches
  const fetchBatches = async () => {
    console.log("Inside fetchBatches. Current packagesCount:", packagesCount, "Current userRole:", userRole);
    // Ensure packagesCount is a valid BigInt and user is a supplier before proceeding
    if (typeof packagesCount !== 'bigint' || packagesCount < BigInt(0) || userRole !== 1) {
      console.log("Invalid packagesCount or user not supplier, returning from fetchBatches.");
      setBatches([]); // Clear batches if count is invalid or role is not supplier
      return;
    }

    const count = Number(packagesCount);
    const fetchedBatches: Batch[] = [];

    let currentBatchId: string = ""; // Declare currentBatchId outside the try block

    for (let i = 0; i < count; i++) {
      try {
        const batchId = await client.readContract({
          address: supplyChainContractAddress,
          abi: supplyChainContractAbi,
          functionName: 'getPackageIdByIndexS',
          args: [BigInt(i)],
          account: account,
        });
        currentBatchId = batchId as string; // Assign to currentBatchId
        console.log(`Fetched batchId for index ${i}:`, currentBatchId);

        // Now fetch details for each batch from its own contract instance (RawMatrials.sol)
        // Assuming BatchId is the address of a deployed RawMatrials contract
        const rawMaterialAbi = [
          { "inputs": [], "name": "description", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
          { "inputs": [], "name": "farmer_name", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
          { "inputs": [], "name": "location", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
          { "inputs": [], "name": "quantity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
          { "inputs": [], "name": "status", "outputs": [{ "internalType": "enum RawMatrials.packageStatus", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
          { "inputs": [], "name": "productid", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
        ];

        const [descriptionBytes, farmerNameBytes, locationBytes, quantityBigInt, statusUint8, productidAddress] = await Promise.all([
          client.readContract({
            address: currentBatchId as `0x${string}`,
            abi: rawMaterialAbi,
            functionName: 'description',
            account: account,
          }),
          client.readContract({
            address: currentBatchId as `0x${string}`,
            abi: rawMaterialAbi,
            functionName: 'farmer_name',
            account: account,
          }),
          client.readContract({
            address: currentBatchId as `0x${string}`,
            abi: rawMaterialAbi,
            functionName: 'location',
            account: account,
          }),
          client.readContract({
            address: currentBatchId as `0x${string}`,
            abi: rawMaterialAbi,
            functionName: 'quantity',
            account: account,
          }),
          client.readContract({
            address: currentBatchId as `0x${string}`,
            abi: rawMaterialAbi,
            functionName: 'status',
            account: account,
          }),
          client.readContract({
            address: currentBatchId as `0x${string}`,
            abi: rawMaterialAbi,
            functionName: 'productid',
            account: account,
          }),
        ]);

        const description = hexToString(descriptionBytes as `0x${string}`, { size: 32 });
        const farmer = hexToString(farmerNameBytes as `0x${string}`, { size: 32 });
        const location = hexToString(locationBytes as `0x${string}`, { size: 32 });
        const quantity = quantityBigInt.toString();

        const statusMapping: { [key: number]: string } = {
          0: 'At Creator',
          1: 'Picked',
          2: 'Delivered',
        };
        const status = statusMapping[Number(statusUint8)] || 'Unknown';
        const date = new Date().toISOString().split('T')[0]; // Current date for now, can be updated if contract provides it

        fetchedBatches.push({
          id: currentBatchId,
          product: description,
          farmer: farmer,
          location: location,
          quantity: quantity,
          status: status,
          date: date,
        });
      } catch (error) {
        console.error(`Error fetching batch details for ID ${currentBatchId}:`, error);
      }
    }

    setBatches(fetchedBatches);
  };

  const handleCreateBatch = async () => {
    if (!account || !chain) {
      alert('Please connect your wallet first');
      return;
    }

    if (!newBatch.description || !newBatch.farmerName || !newBatch.farmLocation || !newBatch.quantity || !newBatch.shipper || !newBatch.receiver) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Convert strings to bytes32
      const descriptionBytes = toHex(newBatch.description, { size: 32 });
      const farmerNameBytes = toHex(newBatch.farmerName, { size: 32 });
      const locationBytes = toHex(newBatch.farmLocation, { size: 32 });

      // Convert quantity to number
      const quantity = parseInt(newBatch.quantity);
      if (isNaN(quantity)) {
        alert('Invalid quantity');
        return;
      }

      // Ensure addresses have 0x prefix
      const shipperAddress = newBatch.shipper.startsWith('0x') ? newBatch.shipper : `0x${newBatch.shipper}`;
      const receiverAddress = newBatch.receiver.startsWith('0x') ? newBatch.receiver : `0x${newBatch.receiver}`;

      writeContract({
        chain,
        account,
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'createRawPackage',
        args: [
          descriptionBytes as `0x${string}`,
          farmerNameBytes as `0x${string}`,
          locationBytes as `0x${string}`,
          BigInt(quantity),
          shipperAddress as `0x${string}`,
          receiverAddress as `0x${string}`
        ],
      });

    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Failed to create batch: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
                <p className="text-sm text-gray-600">Create and track raw material batches</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateBatch(true)} 
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              disabled={isWritePending || isConfirming}
            >
              <Plus className="h-4 w-4" />
              <span>{isWritePending || isConfirming ? 'Processing...' : 'Create Batch'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isPackagesCountLoading ? '...' : Number(packagesCount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Created batches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {batches.filter(b => b.status === 'In Transit').length}
              </div>
              <p className="text-xs text-muted-foreground">Being transported</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {batches.filter(b => b.status === 'Delivered').length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Batch Form */}
        {showCreateBatch && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Raw Material Batch</CardTitle>
              <CardDescription>Add a new batch of raw materials to the supply chain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter product description"
                    value={newBatch.description}
                    onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 300"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmerName">Farmer Name</Label>
                  <Input
                    id="farmerName"
                    placeholder="Enter farmer/farm name"
                    value={newBatch.farmerName}
                    onChange={(e) => setNewBatch({ ...newBatch, farmerName: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmLocation">Farm Location</Label>
                  <Input
                    id="farmLocation"
                    placeholder="City, State"
                    value={newBatch.farmLocation}
                    onChange={(e) => setNewBatch({ ...newBatch, farmLocation: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipper">Shipper Address</Label>
                  <Input
                    id="shipper"
                    placeholder="0x..."
                    value={newBatch.shipper}
                    onChange={(e) => setNewBatch({ ...newBatch, shipper: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiver">Receiver Address</Label>
                  <Input
                    id="receiver"
                    placeholder="0x..."
                    value={newBatch.receiver}
                    onChange={(e) => setNewBatch({ ...newBatch, receiver: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateBatch(false)}
                  disabled={isWritePending || isConfirming}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBatch} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isWritePending || isConfirming}
                >
                  {isWritePending || isConfirming ? 'Creating...' : 'Create Batch'}
                </Button>
              </div>
              {writeError && (
                <div className="mt-2 text-sm text-red-600">
                  Error: {writeError.message}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Batches List */}
        <Card>
          <CardHeader>
            <CardTitle>My Batches</CardTitle>
            <CardDescription>Track all your raw material batches</CardDescription>
          </CardHeader>
          <CardContent>
            {isPackagesCountLoading ? (
              <div className="text-center py-4">Loading batches...</div>
            ) : batches.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No batches found</div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{batch.id}</h3>
                        {getStatusIcon(batch.status)}
                      </div>
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div><strong>Product:</strong> {batch.product}</div>
                      <div><strong>Farmer:</strong> {batch.farmer}</div>
                      <div><strong>Location:</strong> {batch.location}</div>
                      <div><strong>Quantity:</strong> {batch.quantity}</div>
                      <div><strong>Date:</strong> {batch.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};