import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Package, CheckCircle, Send } from 'lucide-react';

interface WholesalerDashboardProps {
  onBack: () => void;
}

export const WholesalerDashboard: React.FC<WholesalerDashboardProps> = ({ onBack }) => {
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [receiveBatchId, setReceiveBatchId] = useState('');
  const [transferData, setTransferData] = useState({
    batchId: '',
    distributorAddress: ''
  });

  const receivedBatches = [
    { id: 'MED001', medicine: 'Pain Relief Cream', quantity: '1000 units', status: 'Quality Verified', date: '2024-06-01' },
    { id: 'MED002', medicine: 'Anti-inflammatory Tablets', quantity: '2000 units', status: 'Ready to Transfer', date: '2024-06-02' }
  ];

  const transferredBatches = [
    { id: 'MED003', medicine: 'Vitamin D Supplements', quantity: '500 units', distributor: 'East Coast Dist.', date: '2024-05-30' },
    { id: 'MED004', medicine: 'Cold Medicine', quantity: '1500 units', distributor: 'Regional Pharma', date: '2024-05-28' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wholesaler Dashboard</h1>
                <p className="text-sm text-gray-600">Receive and distribute medicine batches</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowReceiveForm(true)} variant="outline">
                Receive Medicine
              </Button>
              <Button onClick={() => setShowTransferForm(true)} className="bg-purple-600 hover:bg-purple-700">
                Transfer to Distributor
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
              <CardTitle className="text-sm font-medium">Received Batches</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <p className="text-xs text-muted-foreground">Passed inspection</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transferred</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">To distributors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground">Current stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Receive Form */}
        {showReceiveForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Receive Medicine Batch</CardTitle>
              <CardDescription>Mark a medicine batch as received from manufacturer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiveBatchId">Medicine Batch ID</Label>
                <Input
                  id="receiveBatchId"
                  placeholder="Enter medicine batch ID"
                  value={receiveBatchId}
                  onChange={(e) => setReceiveBatchId(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReceiveForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log('Receiving medicine batch:', receiveBatchId);
                  setReceiveBatchId('');
                  setShowReceiveForm(false);
                }}>
                  Confirm Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transfer Form */}
        {showTransferForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Transfer to Distributor</CardTitle>
              <CardDescription>Transfer medicine batch to a distributor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transferBatchId">Medicine Batch ID</Label>
                  <Input
                    id="transferBatchId"
                    placeholder="Enter batch ID to transfer"
                    value={transferData.batchId}
                    onChange={(e) => setTransferData({ ...transferData, batchId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distributorAddress">Distributor Address</Label>
                  <Input
                    id="distributorAddress"
                    placeholder="0x..."
                    value={transferData.distributorAddress}
                    onChange={(e) => setTransferData({ ...transferData, distributorAddress: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowTransferForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log('Transferring batch:', transferData);
                  setTransferData({ batchId: '', distributorAddress: '' });
                  setShowTransferForm(false);
                }} className="bg-purple-600 hover:bg-purple-700">
                  Transfer Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Received Batches */}
          <Card>
            <CardHeader>
              <CardTitle>Received Medicine Batches</CardTitle>
              <CardDescription>Medicine batches from manufacturers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receivedBatches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                      <Badge variant={batch.status === 'Quality Verified' ? 'default' : 'secondary'}>
                        {batch.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Medicine:</strong> {batch.medicine}</div>
                      <div><strong>Quantity:</strong> {batch.quantity}</div>
                      <div><strong>Date:</strong> {batch.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transferred Batches */}
          <Card>
            <CardHeader>
              <CardTitle>Transferred Batches</CardTitle>
              <CardDescription>Batches sent to distributors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transferredBatches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                      <Badge className="bg-green-100 text-green-800">
                        Transferred
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Medicine:</strong> {batch.medicine}</div>
                      <div><strong>Quantity:</strong> {batch.quantity}</div>
                      <div><strong>To:</strong> {batch.distributor}</div>
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