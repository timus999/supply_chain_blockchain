
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface BatchTrackerProps {
  onBack: () => void;
}

export const BatchTracker: React.FC<BatchTrackerProps> = ({ onBack }) => {
  const [batchId, setBatchId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleSearch = () => {
    // Mock tracking data
    const mockData = {
      id: batchId || 'MED001',
      product: 'Pain Relief Cream',
      currentStatus: 'Delivered to Pharmacy',
      timeline: [
        {
          stage: 'Raw Material Creation',
          entity: 'Green Valley Farm',
          location: 'California',
          timestamp: '2024-05-25 08:00',
          status: 'completed',
          details: 'Aloe Vera Extract - 500kg harvested'
        },
        {
          stage: 'Transportation to Manufacturer',
          entity: 'FastTrans Logistics',
          location: 'CA → TX',
          timestamp: '2024-05-26 14:30',
          status: 'completed',
          details: 'Picked up and in transit'
        },
        {
          stage: 'Manufacturing',
          entity: 'PharmaCorp Inc.',
          location: 'Texas',
          timestamp: '2024-05-28 10:15',
          status: 'completed',
          details: 'Manufactured 1000 units of Pain Relief Cream'
        },
        {
          stage: 'Quality Control',
          entity: 'PharmaCorp Inc.',
          location: 'Texas',
          timestamp: '2024-05-29 16:45',
          status: 'completed',
          details: 'Quality verified - Excellent grade'
        },
        {
          stage: 'Wholesale Distribution',
          entity: 'MediWholesale LLC',
          location: 'New York',
          timestamp: '2024-06-01 09:20',
          status: 'completed',
          details: 'Received and quality verified'
        },
        {
          stage: 'Regional Distribution',
          entity: 'East Coast Distributors',
          location: 'New York',
          timestamp: '2024-06-02 11:00',
          status: 'completed',
          details: 'Distributed to pharmacy network'
        },
        {
          stage: 'Final Delivery',
          entity: 'City Pharmacy',
          location: 'New York',
          timestamp: '2024-06-03 15:30',
          status: 'completed',
          details: 'Available for sale to patients'
        }
      ]
    };
    setTrackingData(mockData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Batch Tracker</h1>
                <p className="text-sm text-gray-600">Track any batch through the entire supply chain</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Track Batch</CardTitle>
            <CardDescription>Enter a batch ID to view its complete journey through the supply chain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter Batch ID (e.g., MED001, RAW002)"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Track</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Batch Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Batch {trackingData.id}</CardTitle>
                    <CardDescription>{trackingData.product}</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {trackingData.currentStatus}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Journey</CardTitle>
                <CardDescription>Complete timeline of batch movement and processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.timeline.map((event: any, index: number) => (
                    <div key={index} className="relative">
                      {index !== trackingData.timeline.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{event.stage}</h3>
                            <span className="text-sm text-gray-500">{event.timestamp}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-4">
                              <span><strong>Entity:</strong> {event.entity}</span>
                              <span><strong>Location:</strong> {event.location}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {event.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quality Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-green-600">Excellent</p>
                    <p className="text-sm text-gray-600">All quality checks passed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transit Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Truck className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-blue-600">9 Days</p>
                    <p className="text-sm text-gray-600">Farm to pharmacy</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stakeholders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Package className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-purple-600">7</p>
                    <p className="text-sm text-gray-600">Entities involved</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
