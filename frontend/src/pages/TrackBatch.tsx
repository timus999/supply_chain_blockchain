
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Factory, Building2, Store, Hospital } from 'lucide-react';

export const TrackBatch: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from blockchain
    const fetchBatchData = async () => {
      setLoading(true);
      
      // Mock data - in real implementation, this would query the smart contract
      const mockData = {
        id: batchId,
        product: batchId === 'MED001' ? 'Pain Relief Ointment' : 
                 batchId === 'MED002' ? 'Anti-inflammatory Tablets' : 
                 batchId === 'MED003' ? 'Vitamin D Supplements' : 'Unknown Medicine',
        currentStatus: 'Available at Pharmacy',
        timeline: [
          {
            stage: 'Raw Material Collection',
            entity: 'Green Hills Herbal Farm',
            location: 'Chitwan, Nepal',
            timestamp: '2025-02-12 08:00',
            status: 'completed',
            details: '500kg Aloe Vera harvested and quality checked',
            icon: Package
          },
          {
            stage: 'Transportation to Manufacturer',
            entity: 'Sajilo Logistics',
            location: 'Chitwan → Hetauda',
            timestamp: '2025-02-13 14:30',
            status: 'completed',
            details: 'Temperature-controlled vehicle dispatched',
            icon: Truck
          },
          {
            stage: 'Manufacturing',
            entity: 'Nepal Pharma Ltd.',
            location: 'Hetauda, Nepal',
            timestamp: '2025-02-15 10:15',
            status: 'completed',
            details: '1,000 units manufactured and batch-tested',
            icon: Factory
          },
          {
            stage: 'Wholesale Distribution',
            entity: 'Himal Wholesale Distributors',
            location: 'Kathmandu, Nepal',
            timestamp: '2025-02-18 09:20',
            status: 'completed',
            details: 'Inventory received and quality verified',
            icon: Building2
          },
          {
            stage: 'Regional Distribution',
            entity: 'Bagmati Distributors',
            location: 'Kathmandu, Nepal',
            timestamp: '2025-02-19 11:00',
            status: 'completed',
            details: 'Supplied to authorized pharmacy network in the region',
            icon: Store
          },
          {
            stage: 'Pharmacy Receipt',
            entity: 'Metro City Pharmacy',
            location: 'Lalitpur, Nepal',
            timestamp: '2025-02-20 15:30',
            status: 'completed',
            details: 'Final quality check complete — medicine available for sale',
            icon: Hospital
          }
        ]
      };
      
      
      setTimeout(() => {
        setTrackingData(mockData);
        setLoading(false);
      }, 1000);
    };

    if (batchId) {
      fetchBatchData();
    }
  }, [batchId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading batch information...</p>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Batch Not Found</CardTitle>
            <CardDescription>The batch ID "{batchId}" was not found in our system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.history.back()} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Pharmaceutical Batch Tracking</h1>
            <p className="text-gray-600 mt-2">Transparent supply chain verification</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Batch Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Batch {trackingData.id}</CardTitle>
                <CardDescription className="text-lg">{trackingData.product}</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                {trackingData.currentStatus}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Journey</CardTitle>
            <CardDescription>Complete verified history from source to pharmacy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {trackingData.timeline.map((event: any, index: number) => {
                const IconComponent = event.icon;
                return (
                  <div key={index} className="relative">
                    {index !== trackingData.timeline.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-white rounded-full p-2 border-2 border-gray-200">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{event.stage}</h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(event.status)}
                            <span className="text-sm text-gray-500">{event.timestamp}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <span><strong>Entity:</strong> {event.entity}</span>
                            <span><strong>Location:</strong> {event.location}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {event.details}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Verification Notice */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Blockchain Verified</h3>
                <p className="text-green-700 text-sm">
                  All information on this page is cryptographically verified and stored on the blockchain, 
                  ensuring complete transparency and immutability of the supply chain data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TrackBatch;
