
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Hospital, Package, CheckCircle, AlertTriangle, QrCode, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

interface PharmaDashboardProps {
  onBack: () => void;
}

export const PharmaDashboard: React.FC<PharmaDashboardProps> = ({ onBack }) => {
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedBatchForQR, setSelectedBatchForQR] = useState<string | null>(null);
  const [receiveBatchId, setReceiveBatchId] = useState('');
  const [updateData, setUpdateData] = useState({
    batchId: '',
    status: '',
    quality: ''
  });

  const receivedBatches = [
    { id: 'MED001', medicine: 'Pain Relief Cream', quantity: '1000 units', status: 'Available', quality: 'Excellent', date: '2024-06-01' },
    { id: 'MED002', medicine: 'Anti-inflammatory Tablets', quantity: '2000 units', status: 'Available', quality: 'Good', date: '2024-06-02' },
    { id: 'MED003', medicine: 'Vitamin D Supplements', quantity: '500 units', status: 'Dispensed', quality: 'Excellent', date: '2024-05-30' }
  ];

  const generateTrackingUrl = (batchId: string) => {
    return `${window.location.origin}/track/${batchId}`;
  };

  const downloadQRCode = (batchId: string) => {
    const svg = document.getElementById(`qr-${batchId}`) as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const url = canvas.toDataURL();
        const link = document.createElement('a');
        link.download = `batch-${batchId}-qr.png`;
        link.href = url;
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
                <p className="text-sm text-gray-600">Final quality control and medicine status management</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowReceiveForm(true)} variant="outline">
                Receive Medicine
              </Button>
              <Button onClick={() => setShowUpdateForm(true)} className="bg-red-600 hover:bg-red-700">
                Update Status
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
              <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">31</div>
              <p className="text-xs text-muted-foreground">Received this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Ready for sale</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispensed</CardTitle>
              <Hospital className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">Units sold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Receive Form */}
        {showReceiveForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Receive Medicine from Distributor</CardTitle>
              <CardDescription>Mark a medicine batch as received and perform final quality check</CardDescription>
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
                  Receive & Quality Check
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Update Status Form */}
        {showUpdateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Update Medicine Status</CardTitle>
              <CardDescription>Update the status and quality information for a medicine batch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="updateBatchId">Medicine Batch ID</Label>
                  <Input
                    id="updateBatchId"
                    placeholder="Enter batch ID"
                    value={updateData.batchId}
                    onChange={(e) => setUpdateData({ ...updateData, batchId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Medicine Status</Label>
                  <Select value={updateData.status} onValueChange={(value) => setUpdateData({ ...updateData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="dispensed">Dispensed</SelectItem>
                      <SelectItem value="recalled">Recalled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Quality Assessment</Label>
                <Textarea
                  id="quality"
                  placeholder="Enter quality assessment details..."
                  value={updateData.quality}
                  onChange={(e) => setUpdateData({ ...updateData, quality: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUpdateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log('Updating medicine status:', updateData);
                  setUpdateData({ batchId: '', status: '', quality: '' });
                  setShowUpdateForm(false);
                }} className="bg-red-600 hover:bg-red-700">
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medicine Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Inventory</CardTitle>
            <CardDescription>All received medicine batches and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receivedBatches.map((batch, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{batch.id}</h3>
                    <div className="flex space-x-2">
                      <Badge variant={batch.status === 'Available' ? 'default' : 'secondary'}>
                        {batch.status}
                      </Badge>
                      <Badge variant={batch.quality === 'Excellent' ? 'default' : 'outline'}>
                        {batch.quality}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedBatchForQR(batch.id)}
                            className="flex items-center space-x-1"
                          >
                            <QrCode className="h-4 w-4" />
                            <span>QR Code</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Batch Tracking QR Code</DialogTitle>
                            <DialogDescription>
                              Scan this QR code to view the complete tracking history for batch {batch.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col items-center space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <QRCodeSVG
                                id={`qr-${batch.id}`}
                                value={generateTrackingUrl(batch.id)}
                                size={200}
                                level="H"
                                includeMargin={true}
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">
                                Tracking URL: {generateTrackingUrl(batch.id)}
                              </p>
                              <Button 
                                onClick={() => downloadQRCode(batch.id)}
                                className="flex items-center space-x-2"
                              >
                                <Download className="h-4 w-4" />
                                <span>Download QR Code</span>
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div><strong>Medicine:</strong> {batch.medicine}</div>
                    <div><strong>Quantity:</strong> {batch.quantity}</div>
                    <div><strong>Status:</strong> {batch.status}</div>
                    <div><strong>Received:</strong> {batch.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};