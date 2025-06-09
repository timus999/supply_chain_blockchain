import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Factory, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useAccount } from 'wagmi';
import { toHex, stringToBytes, hexToString } from 'viem';
import { supplyChainContractAbi } from '../constants/SupplyChainAbi';
import { supplyChainContractAddress } from '../constants/contractAddress';

interface ManufacturerDashboardProps {
  onBack: () => void;
}

interface Batch {
  id: string;
  product: string;
  quantity: string;
  status: string;
  date: string;
}

export const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({ onBack }) => {
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showManufactureForm, setShowManufactureForm] = useState(false);
  const [receiveBatchId, setReceiveBatchId] = useState('');
  const [manufactureData, setManufactureData] = useState({
    rawBatchId: '',
    medicineName: '',
    quantity: '',
    shipper: '',
    receiver: '',
    receiverType: ''
  });

  const [receivedBatches, setReceivedBatches] = useState<Batch[]>([]);
  const [manufacturedBatches, setManufacturedBatches] = useState<Batch[]>([]);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [lastAction, setLastAction] = useState<'receive' | 'manufacture' | null>(null);

  const client = usePublicClient();
  const { address: account, chain } = useAccount();

  // Define the ABI for Raw Material Batch contracts (copied from SupplierDashboard.tsx)
  const rawMaterialBatchAbi = [
    { "inputs": [], "name": "description", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "farmer_name", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "location", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "quantity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "status", "outputs": [{ "internalType": "enum RawMatrials.packageStatus", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "productid", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  ];

  // Define a simplified ABI for Medicine Batch contracts
  const medicineBatchAbi = [
    { "inputs": [], "name": "description", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "quantity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "status", "outputs": [{ "internalType": "enum MedicineBatch.packageStatus", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }
  ];

  // Fetch connected account's role
  const { data: userRole, isLoading: isUserRoleLoading, isError: isUserRoleError, error: userRoleError } = useReadContract({
    address: supplyChainContractAddress,
    abi: supplyChainContractAbi,
    functionName: 'getUserInfo',
    args: [account as `0x${string}`],
    query: {
      enabled: !!account,
      select: (data) => data[3],
    },
  });

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

  // Function to fetch received batches
  const fetchReceivedBatches = async () => {
    if (!account || userRole !== 3) return; // 3 is manufacturer role

    try {
      const count = await client.readContract({
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'getPackagesCountM',
        account: account,
      });

      const batches: Batch[] = [];
      for (let i = 0; i < Number(count); i++) {
        const batchId = await client.readContract({
          address: supplyChainContractAddress,
          abi: supplyChainContractAbi,
          functionName: 'getPackageIDByIndexM',
          args: [BigInt(i)],
          account: account,
        });
        console.log(`Fetching received batch details for batchId: ${batchId}`);

        const [description, quantity, status] = await Promise.all([
          client.readContract({
            address: batchId as `0x${string}`,
            abi: rawMaterialBatchAbi, // Use the specific ABI for Raw Material Batches
            functionName: 'description',
            account: account,
          }),
          client.readContract({
            address: batchId as `0x${string}`,
            abi: rawMaterialBatchAbi, // Use the specific ABI for Raw Material Batches
            functionName: 'quantity',
            account: account,
          }),
          client.readContract({
            address: batchId as `0x${string}`,
            abi: rawMaterialBatchAbi, // Use the specific ABI for Raw Material Batches
            functionName: 'status',
            account: account,
          })
        ]);

        batches.push({
          id: batchId as string,
          product: hexToString(description as `0x${string}`, { size: 32 }),
          quantity: quantity.toString(),
          status: Number(status) === 0 ? 'Quality Checked' : 'In Use',
          date: new Date().toISOString().split('T')[0]
        });
      }
      setReceivedBatches(batches);
    } catch (error) {
      console.error('Error fetching received batches:', error);
    }
  };

  // Function to fetch manufactured batches
  const fetchManufacturedBatches = async () => {
    if (!account || userRole !== 3) return;

    try {
      // Use getBatchesCountM for manufactured medicines
      const count = await client.readContract({
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'getBatchesCountM',
        account: account,
      });

      console.log(`Total manufactured batches from getBatchesCountM: ${Number(count)}`);

      const batches: Batch[] = [];
      for (let i = 0; i < Number(count); i++) {
        // Use getBatchIdByIndexM for manufactured medicines
        const batchId = await client.readContract({
          address: supplyChainContractAddress,
          abi: supplyChainContractAbi,
          functionName: 'getBatchIdByIndexM',
          args: [BigInt(i)],
          account: account,
        });
        console.log(`Fetching manufactured medicine details for batchId: ${batchId}`);

        // Directly fetch medicine batch details
        const [description, quantity, status] = await Promise.all([
          client.readContract({
            address: batchId as `0x${string}`,
            abi: medicineBatchAbi, // Use the specific ABI for Medicine Batches
            functionName: 'description',
            account: account,
          }),
          client.readContract({
            address: batchId as `0x${string}`,
            abi: medicineBatchAbi, // Use the specific ABI for Medicine Batches
            functionName: 'quantity',
            account: account,
          }),
          client.readContract({
            address: batchId as `0x${string}`,
            abi: medicineBatchAbi, // Use the specific ABI for Medicine Batches
            functionName: 'status',
            account: account,
          })
        ]);

        batches.push({
          id: batchId as string,
          product: hexToString(description as `0x${string}`, { size: 32 }),
          quantity: quantity.toString(),
          status: Number(status) === 2 ? 'Ready for Shipment' : 'In Production',
          date: new Date().toISOString().split('T')[0]
        });
        console.log(`Added manufactured medicine: ${batchId}, Product: ${hexToString(description as `0x${string}`, { size: 32 })}`);
      }
      setManufacturedBatches(batches);
      console.log(`Finished fetching manufactured batches. Total found: ${batches.length}`);
    } catch (error) {
      console.error('Error fetching manufactured batches:', error);
    }
  };

  // Effect to fetch batches when component mounts and when account changes
  useEffect(() => {
    if (account && userRole === 3) {
      fetchReceivedBatches();
      fetchManufacturedBatches();
    }
  }, [account, userRole]);

  // Effect to handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      console.log('Transaction confirmed!');
      
      // Only reset manufacture form if it was open
      if (showManufactureForm) {
        setManufactureData({
          rawBatchId: '',
          medicineName: '',
          quantity: '',
          shipper: '',
          receiver: '',
          receiverType: ''
        });
        setShowManufactureForm(false);
      }

      // Fetch only the relevant batches based on the last action
      if (lastAction === 'receive') {
        fetchReceivedBatches();
      } else if (lastAction === 'manufacture') {
        fetchManufacturedBatches();
      }

      // Reset the last action
      setLastAction(null);
    }
    if (confirmError) {
      console.error('Transaction confirmation error:', confirmError);
      alert('Transaction failed: ' + confirmError.message);
    }
  }, [isConfirmed, confirmError]);

  const handleReceiveMaterial = async () => {
    if (!account || !chain) {
      alert('Please connect your wallet first');
      return;
    }

    if (!receiveBatchId) {
      alert('Please enter a batch ID');
      return;
    }

    try {
      const batchAddress = receiveBatchId.startsWith('0x') ? receiveBatchId : `0x${receiveBatchId}`;
      
      // Set the action type before sending transaction
      setLastAction('receive');
      
      writeContract({
        address: supplyChainContractAddress,
        abi: supplyChainContractAbi,
        functionName: 'rawPackageReceived',
        args: [batchAddress as `0x${string}`],
        account: account,
        chain: chain,
      });

      // Close the receive form and clear the input
      setShowReceiveForm(false);
      setReceiveBatchId('');

    } catch (error) {
      console.error('Error receiving material:', error);
      alert('Failed to receive material: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleManufacture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !chain || !manufactureData.medicineName || !manufactureData.rawBatchId || !manufactureData.quantity || !manufactureData.shipper || !manufactureData.receiver) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Convert medicine name to bytes32 (truncated to 31 characters)
      const descriptionBytes = toHex(manufactureData.medicineName.slice(0, 31), { size: 32 });
      
      // Convert raw material ID to bytes32 (truncated to 31 characters)
      const rawMaterialBytes = toHex(manufactureData.rawBatchId.slice(0, 31), { size: 32 });
      
      const quantity = parseInt(manufactureData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
      }

      // Ensure addresses are valid
      const shipperAddress = manufactureData.shipper as `0x${string}`;
      const receiverAddress = manufactureData.receiver as `0x${string}`;

      // Set action type for transaction confirmation
      setLastAction('manufacture');

      // Call the contract function
      const hash = await writeContract({
        address: supplyChainContractAddress as `0x${string}`,
        abi: supplyChainContractAbi,
        functionName: 'manufacturMadicine',
        args: [
          descriptionBytes,    // Description (bytes32)
          rawMaterialBytes,    // Raw Material (bytes32)
          BigInt(quantity),    // Quantity (uint256)
          shipperAddress,      // Shipper (address)
          receiverAddress,     // Receiver (address)
          BigInt(1)            // Receiver Type (uint256) - 1 for Distributor
        ],
        account: account,
        chain: chain,
      });
    

      console.log('Manufacturing medicine:', hash);

      // Close form and clear inputs
      setShowManufactureForm(false);
      setManufactureData({
        medicineName: '',
        rawBatchId: '',
        quantity: '',
        shipper: '',
        receiver: '',
        receiverType: ''
      });

    } catch (error) {
      console.error('Error manufacturing medicine:', error);
      alert('Failed to manufacture medicine: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manufacturer Dashboard</h1>
                <p className="text-sm text-gray-600">Receive materials and manufacture medicine</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowReceiveForm(true)} variant="outline">
                Receive Materials
              </Button>
              <Button onClick={() => setShowManufactureForm(true)} className="bg-blue-600 hover:bg-blue-700">
                Manufacture Medicine
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Raw Materials</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receivedBatches.length}</div>
              <p className="text-xs text-muted-foreground">Batches received</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Production</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {manufacturedBatches.filter(b => b.status === 'In Production').length}
              </div>
              <p className="text-xs text-muted-foreground">Medicine batches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {manufacturedBatches.filter(b => b.status === 'Ready for Shipment').length}
              </div>
              <p className="text-xs text-muted-foreground">Total produced</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Receive Materials Form */}
        {showReceiveForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Receive Raw Materials</CardTitle>
              <CardDescription>Mark a batch of raw materials as received</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiveBatchId">Batch ID</Label>
                <Input
                  id="receiveBatchId"
                  placeholder="Enter batch ID (e.g., 0x...)"
                  value={receiveBatchId}
                  onChange={(e) => setReceiveBatchId(e.target.value)}
                  disabled={isWritePending || isConfirming}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReceiveForm(false)} disabled={isWritePending || isConfirming}>
                  Cancel
                </Button>
                <Button onClick={handleReceiveMaterial} disabled={isWritePending || isConfirming}>
                  {isWritePending || isConfirming ? 'Processing...' : 'Confirm Receipt'}
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

        {/* Manufacture Form */}
        {showManufactureForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Manufacture Medicine</CardTitle>
              <CardDescription>Create a new medicine batch from raw materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rawBatchId">Raw Material Batch ID</Label>
                  <Input
                    id="rawBatchId"
                    placeholder="e.g., 0x..."
                    value={manufactureData.rawBatchId}
                    onChange={(e) => setManufactureData({ ...manufactureData, rawBatchId: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Input
                    id="medicineName"
                    placeholder="e.g., Pain Relief Cream"
                    value={manufactureData.medicineName}
                    onChange={(e) => setManufactureData({ ...manufactureData, medicineName: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Produced</Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 1000 units"
                    value={manufactureData.quantity}
                    onChange={(e) => setManufactureData({ ...manufactureData, quantity: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverType">Receiver Type</Label>
                  <Input
                    id="receiverType"
                    placeholder="e.g., Wholesaler"
                    value={manufactureData.receiverType}
                    onChange={(e) => setManufactureData({ ...manufactureData, receiverType: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipper">Shipper Address</Label>
                  <Input
                    id="shipper"
                    placeholder="0x..."
                    value={manufactureData.shipper}
                    onChange={(e) => setManufactureData({ ...manufactureData, shipper: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiver">Receiver Address</Label>
                  <Input
                    id="receiver"
                    placeholder="0x..."
                    value={manufactureData.receiver}
                    onChange={(e) => setManufactureData({ ...manufactureData, receiver: e.target.value })}
                    disabled={isWritePending || isConfirming}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowManufactureForm(false)} disabled={isWritePending || isConfirming}>
                  Cancel
                </Button>
                <Button onClick={handleManufacture} className="bg-blue-600 hover:bg-blue-700" disabled={isWritePending || isConfirming}>
                  {isWritePending || isConfirming ? 'Processing...' : 'Start Manufacturing'}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Received Raw Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Received Raw Materials</CardTitle>
              <CardDescription>Materials ready for manufacturing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receivedBatches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                      <Badge variant={batch.status === 'Quality Checked' ? 'default' : 'secondary'}>
                        {batch.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Product:</strong> {batch.product}</div>
                      <div><strong>Quantity:</strong> {batch.quantity}</div>
                      <div><strong>Date:</strong> {batch.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manufactured Medicines */}
          <Card>
            <CardHeader>
              <CardTitle>Manufactured Medicines</CardTitle>
              <CardDescription>Produced medicine batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {manufacturedBatches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                      <Badge variant={batch.status === 'Ready for Shipment' ? 'default' : 'secondary'}>
                        {batch.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Medicine:</strong> {batch.product}</div>
                      <div><strong>Quantity:</strong> {batch.quantity}</div>
                      <div><strong>Date:</strong> {batch.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};