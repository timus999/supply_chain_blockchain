
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Store, Package, CheckCircle, Send } from 'lucide-react';

interface DistributorDashboardProps {
  onBack: () => void;
}

export const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ onBack }) => {
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showDistributeForm, setShowDistributeForm] = useState(false);
  const [receiveBatchId, setReceiveBatchId] = useState('');
  const [distributeData, setDistributeData] = useState({
    batchId: '',
    pharmacyAddress: ''
  });

  const receivedBatches = [
    { id: 'MED001', medicine: 'Pain Relief Cream', quantity: '1000 units', status: 'Verified', date: '2024-06-01' },
    { id: 'MED002', medicine: 'Anti-inflammatory Tablets', quantity: '2000 units', status: 'Ready', date: '2024-06-02' }
  ];

  const distributedBatches = [
    { id: 'MED003', medicine: 'Vitamin D Supplements', quantity: '500 units', pharmacy: 'City Pharmacy', date: '2024-05-30' },
    { id: 'MED004', medicine: 'Cold Medicine', quantity: '1500 units', pharmacy: 'HealthCare Plus', date: '2024-05-28' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h1>
                <p className="text-sm text-gray-600">Distribute medicine to pharmacies</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowReceiveForm(true)} variant="outline">
                Receive Medicine
              </Button>
              <Button onClick={() => setShowDistributeForm(true)} className="bg-orange-600 hover:bg-orange-700">
                Distribute to Pharmacy
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
              <CardTitle className="text-sm font-medium">Received</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Batches this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">21</div>
              <p className="text-xs text-muted-foreground">Quality checked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distributed</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">19</div>
              <p className="text-xs text-muted-foreground">To pharmacies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Pharmacies</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Active partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Receive Form */}
        {showReceiveForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Receive Medicine from Wholesaler</CardTitle>
              <CardDescription>Mark a medicine batch as received and verified</CardDescription>
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
                  Confirm Receipt & Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Distribute Form */}
        {showDistributeForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Distribute to Pharmacy</CardTitle>
              <CardDescription>Send medicine batch to pharmacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distributeBatchId">Medicine Batch ID</Label>
                  <Input
                    id="distributeBatchId"
                    placeholder="Enter batch ID to distribute"
                    value={distributeData.batchId}
                    onChange={(e) => setDistributeData({ ...distributeData, batchId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacyAddress">Pharmacy Address</Label>
                  <Input
                    id="pharmacyAddress"
                    placeholder="0x..."
                    value={distributeData.pharmacyAddress}
                    onChange={(e) => setDistributeData({ ...distributeData, pharmacyAddress: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDistributeForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log('Distributing batch:', distributeData);
                  setDistributeData({ batchId: '', pharmacyAddress: '' });
                  setShowDistributeForm(false);
                }} className="bg-orange-600 hover:bg-orange-700">
                  Distribute to Pharmacy
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
              <CardDescription>Medicine batches from wholesalers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receivedBatches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                      <Badge variant={batch.status === 'Verified' ? 'default' : 'secondary'}>
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

          {/* Distributed Batches */}
          <Card>
            <CardHeader>
              <CardTitle>Distributed Batches</CardTitle>
              <CardDescription>Batches sent to pharmacies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributedBatches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{batch.id}</h3>
                      <Badge className="bg-green-100 text-green-800">
                        Distributed
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Medicine:</strong> {batch.medicine}</div>
                      <div><strong>Quantity:</strong> {batch.quantity}</div>
                      <div><strong>To:</strong> {batch.pharmacy}</div>
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