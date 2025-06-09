import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Factory, 
  Truck, 
  Building2, 
  Store, 
  Hospital,
  Shield,
  Search,
  Plus,
  Activity
} from 'lucide-react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { SupplierDashboard } from '@/components/SupplierDashboard';
import { ManufacturerDashboard } from '../components/ManufacturerDashboard';
import { TransporterDashboard } from '@/components/TransporterDashboard';
import { PharmaDashboard } from '@/components/PharmaDashboard';
import { BatchTracker } from '@/components/BatchTracker';
import { useAccount, useReadContract } from 'wagmi';



// Define your contract address and ABI
const supplyChainContractAddress = '0xDb768D6B85C0A6E67D97c5b5dC6f15CccCdc888c' as const; // Replace with your actual deployed contract address
const supplyChainContractAbi = [
	{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"BatchId","type":"address"},{"indexed":true,"internalType":"address","name":"Manufacturer","type":"address"},{"indexed":false,"internalType":"address","name":"shipper","type":"address"},{"indexed":true,"internalType":"address","name":"Receiver","type":"address"}],"name":"MadicineNewBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"BatchID","type":"address"},{"indexed":true,"internalType":"address","name":"Pharma","type":"address"},{"indexed":false,"internalType":"uint256","name":"status","type":"uint256"}],"name":"MadicineStatus","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ProductID","type":"address"},{"indexed":true,"internalType":"address","name":"Supplier","type":"address"},{"indexed":false,"internalType":"address","name":"Shipper","type":"address"},{"indexed":true,"internalType":"address","name":"Receiver","type":"address"}],"name":"RawSupplyInit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"EthAddress","type":"address"},{"indexed":false,"internalType":"bytes32","name":"Name","type":"bytes32"}],"name":"UserRegister","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"EthAddress","type":"address"},{"indexed":false,"internalType":"bytes32","name":"Name","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"Role","type":"uint256"}],"name":"UserRoleRessigne","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"EthAddress","type":"address"},{"indexed":false,"internalType":"bytes32","name":"Name","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"Role","type":"uint256"}],"name":"UserRoleRevoked","type":"event"},{"inputs":[],"name":"Owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"UsersDetails","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"bytes32","name":"location","type":"bytes32"},{"internalType":"address","name":"ethAddress","type":"address"},{"internalType":"enum SupplyChain.roles","name":"role","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"Des","type":"bytes32"},{"internalType":"bytes32","name":"FN","type":"bytes32"},{"internalType":"bytes32","name":"Loc","type":"bytes32"},{"internalType":"uint256","name":"Quant","type":"uint256"},{"internalType":"address","name":"Shpr","type":"address"},{"internalType":"address","name":"Rcvr","type":"address"}],"name":"createRawPackage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getBatchIdByIndexDP","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getBatchIdByIndexM","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getBatchIdByIndexP","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getBatchIdByIndexWD","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBatchesCountDP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBatchesCountM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBatchesCountP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBatchesCountWD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getPackageIDByIndexM","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getPackageIdByIndexS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPackagesCountM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPackagesCountS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"BatchID","type":"address"}],"name":"getSubContractDP","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"BatchID","type":"address"}],"name":"getSubContractWD","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"User","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"bytes32","name":"location","type":"bytes32"},{"internalType":"address","name":"ethAddress","type":"address"},{"internalType":"enum SupplyChain.roles","name":"role","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserbyIndex","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"bytes32","name":"location","type":"bytes32"},{"internalType":"address","name":"ethAddress","type":"address"},{"internalType":"enum SupplyChain.roles","name":"role","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUsersCount","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pid","type":"address"},{"internalType":"uint256","name":"transportertype","type":"uint256"},{"internalType":"address","name":"cid","type":"address"}],"name":"loadConsingment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"batchid","type":"address"},{"internalType":"address","name":"cid","type":"address"}],"name":"madicineReceived","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"batchid","type":"address"},{"internalType":"address","name":"cid","type":"address"}],"name":"madicineRecievedAtPharma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"Des","type":"bytes32"},{"internalType":"bytes32","name":"RM","type":"bytes32"},{"internalType":"uint256","name":"Quant","type":"uint256"},{"internalType":"address","name":"Shpr","type":"address"},{"internalType":"address","name":"Rcvr","type":"address"},{"internalType":"uint256","name":"RcvrType","type":"uint256"}],"name":"manufacturMadicine","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pid","type":"address"}],"name":"rawPackageReceived","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint256","name":"Role","type":"uint256"}],"name":"reassigneRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"EthAddress","type":"address"},{"internalType":"bytes32","name":"Name","type":"bytes32"},{"internalType":"bytes32","name":"Location","type":"bytes32"},{"internalType":"uint256","name":"Role","type":"uint256"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"BatchID","type":"address"}],"name":"salesInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"BatchID","type":"address"},{"internalType":"address","name":"Shipper","type":"address"},{"internalType":"address","name":"Receiver","type":"address"}],"name":"transferMadicineDtoP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"BatchID","type":"address"},{"internalType":"address","name":"Shipper","type":"address"},{"internalType":"address","name":"Receiver","type":"address"}],"name":"transferMadicineWtoD","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"BatchID","type":"address"},{"internalType":"uint256","name":"Status","type":"uint256"}],"name":"updateSaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Your contract ABI

// Define the hardcoded admin address (replace with the actual admin address)
const adminAddress = '0x782ef9eE9dAc68a2328D61b47a64F8d5Dd7C4C3a' as const; // TODO: Replace with actual admin wallet address

type Role = 'admin' | 'supplier' | 'manufacturer' | 'transporter' | 'pharma' | null | 'norole' | 'revoke' | 'unsupported'; // Removed wholesaler and distributor, added unsupported

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showBatchTracker, setShowBatchTracker] = useState(false);

  const { address, isConnected } = useAccount(); // Get connected account details
  // Remove useConnect and useDisconnect hooks
  // const { connect, connectors, error, isPending: connectLoading } = useConnect(); // Get connection functions and state
  // const { disconnect } = useDisconnect(); // Get the disconnect function


  const [testPharmaMode, setTestPharmaMode] = useState(false);


  // Fetch user role from the smart contract
  const { data: userRoleData, isLoading: isRoleLoading, error: roleError } = useReadContract({
    address: supplyChainContractAddress,
    abi: supplyChainContractAbi,
    functionName: 'getUserInfo',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address, // Only fetch if wallet is connected
      select: (data) => { // Select and map the role from the returned struct
        const roleEnum = data[3]; // The fourth element is the role (uint8)
        switch (roleEnum) {
          case 0: return 'norole';
          case 1: return 'supplier';
          case 2: return 'transporter';
          case 3: return 'manufacturer';
          case 4: return 'wholesaler';
          case 5: return 'distributor'; // Mapping 'distributer' (5) to 'distributor'
          case 6: return 'pharma';
          case 7: return 'revoke';
          default: return null; // Handle unexpected values
        }
      },
    },
  });

  // Determine the effective role for rendering
  const effectiveRole: Role = useMemo(() => {
    if (!isConnected || !address) return null; // No role if not connected
    if (address.toLowerCase() === adminAddress.toLowerCase()) {
      return 'admin'; // Hardcoded admin check
    } else if (userRoleData) {
      const contractRole = userRoleData as Role;
      // Map smart contract roles to supported frontend roles
      switch (contractRole) {
        case 'supplier':
        case 'manufacturer':
        case 'transporter':
        case 'pharma':
        case 'norole':
        case 'revoke':
          return contractRole;
        default:
          // Treat unsupported roles from contract as unsupported in frontend
          return 'unsupported';
      }
    } else if (isRoleLoading) {
      return null; // Or a loading state role if you want to show something specific
    } else if (roleError) {
       console.error("Error fetching user role:", roleError);
       return 'norole'; // Or some error state role
    }
    return null; // Default to null if no conditions met
  }, [isConnected, address, adminAddress, userRoleData, isRoleLoading, roleError]);

  // Effect to set selected role based on effectiveRole
  useEffect(() => {
    // Only set selectedRole based on effectiveRole if a wallet is connected
    if (isConnected) {
      setSelectedRole(effectiveRole);
    } else {
      // Optionally clear selected role when disconnected, or keep the last selected role
      // For now, let's clear it to go back to the main selection screen
      setSelectedRole(null);
    }
  }, [isConnected, effectiveRole]);

  const roles = [
    {
      id: 'admin' as Role,
      title: 'Admin',
      description: 'Manage users and system overview',
      icon: Shield,
      color: 'bg-slate-500 hover:bg-slate-600',
      stats: '5 Active Users'
    },
    {
      id: 'supplier' as Role,
      title: 'Supplier',
      description: 'Create and ship raw material batches',
      icon: Package,
      color: 'bg-green-500 hover:bg-green-600',
      stats: '12 Active Batches'
    },
    {
      id: 'manufacturer' as Role,
      title: 'Manufacturer',
      description: 'Receive materials and produce medicine',
      icon: Factory,
      color: 'bg-blue-500 hover:bg-blue-600',
      stats: '8 In Production'
    },
    {
      id: 'transporter' as Role,
      title: 'Transporter',
      description: 'Handle batch transportation',
      icon: Truck,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      stats: '4 In Transit'
    },
    {
      id: 'pharma' as Role,
      title: 'Pharmacy',
      description: 'Final medicine quality control',
      icon: Hospital,
      color: 'bg-red-500 hover:bg-red-600',
      stats: '31 Ready for Sale'
    }
  ];

  const renderDashboard = () => {

    if (testPharmaMode) {
      return <PharmaDashboard onBack={() => {
        setTestPharmaMode(false);
        setSelectedRole(null);
      }} />;
    }
    // Use the effectiveRole to render the correct dashboard
    switch (effectiveRole) {
      case 'admin':
        return <AdminDashboard onBack={() => setSelectedRole(null)} />;
      case 'supplier':
        return <SupplierDashboard onBack={() => setSelectedRole(null)} />;
      case 'manufacturer':
        return <ManufacturerDashboard onBack={() => setSelectedRole(null)} />;
      case 'transporter':
        return <TransporterDashboard onBack={() => setSelectedRole(null)} />;
      case 'pharma':
        return <PharmaDashboard onBack={() => setSelectedRole(null)} />;
      case 'norole':
        return (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold text-gray-900">No Role Assigned</h2>
            <p className="text-gray-600">Your connected address does not have an assigned role in the supply chain contract.</p>
            {/* Optionally add a way for admins to assign roles */}
          </div>
        );
      case 'revoke':
         return (
          <div className="text-center mt-8 text-red-600">
            <h2 className="text-2xl font-bold">Role Revoked</h2>
            <p>Your role in the supply chain contract has been revoked.</p>
          </div>
        );
      case 'unsupported':
         return (
          <div className="text-center mt-8 text-yellow-600">
            <h2 className="text-2xl font-bold">Role Not Supported</h2>
            <p>Your assigned role is not supported in this version of the application.</p>
          </div>
        );
      default:
        // This case will handle the initial state before effectiveRole is determined
        return null;
    }
  };

  if (showBatchTracker) {
    return <BatchTracker onBack={() => setShowBatchTracker(false)} />;
  }

  // Main rendering logic based on selectedRole state
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MediChain Tracker</h1>
                <p className="text-sm text-gray-600">Pharmaceutical Supply Chain Management</p>
              </div>
            </div>
              {/* TESTING BUTTON: Access Pharma dashboard */}
              <Button 
                onClick={() => setTestPharmaMode(true)}
                variant="outline"
                className="flex items-center space-x-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
              >
                <Hospital className="h-4 w-4" />
                <span>Test Pharma</span>
              </Button>
            {/* Replace manual buttons with <w3m-button /> */}
            <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setShowBatchTracker(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Track Batch</span>
            </Button>
               {/* Web3Modal Connect/Disconnect Button */}
               
               <w3m-button />
            </div>
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        { testPharmaMode ? (
          <PharmaDashboard onBack={ () => {
            setTestPharmaMode(false);
            setSelectedRole(null);
          }} />
        ) :  (
          <>
          
        {/* Render the dashboard if a role is selected */}
        {selectedRole && !showBatchTracker ? (
          renderDashboard()
        ) : (
          // Otherwise, show the role selection grid or a message
          <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Role</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {isConnected ? (
                  effectiveRole === 'norole' || effectiveRole === 'revoke' || effectiveRole === 'unsupported' ? (
                    effectiveRole === 'norole' ? 'Your connected address does not have an assigned role in the supply chain contract.'
                    : effectiveRole === 'revoke' ? 'Your role in the supply chain contract has been revoked.'
                    : 'Your assigned role is not supported in this version of the application.'
                  ) : effectiveRole ? (
                     `Wallet connected as ${effectiveRole}. Click the ${effectiveRole} card to proceed.`
                  ) : (
                    'Choose your role in the pharmaceutical supply chain to access your personalized dashboard and tools.' // Initial state when not connected
                  )
                ) : (
                   'Connect your wallet to see your assigned role and access the dashboard.' // Message when not connected
                )}
          </p>
        </div>

            {/* Show role selection grid only if no dashboard is selected */}
             {!selectedRole && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
                  // Card is clickable if connected, effectiveRole is not norole/revoke/unsupported, and role matches effectiveRole
                  const isClickable = isConnected && effectiveRole === role.id && effectiveRole !== 'norole' && effectiveRole !== 'revoke' && effectiveRole !== 'unsupported';
                  const cardClassName = `hover:shadow-lg transition-all duration-200 group ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`; // Apply disabled style

            return (
              <Card 
                key={role.id} 
                      className={cardClassName} // Use dynamic class name
                      onClick={() => {
                        if (isClickable) {
                           setSelectedRole(role.id); // Only set role if clickable
                        }
                      }}
              >
                <CardHeader className="text-center">
                  <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary" className="bg-gray-100">
                    {role.stats}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
            )}

            {/* Supply Chain Overview remains visible */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Supply Chain Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Active Batches</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">156</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Factory className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">In Production</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">23</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">In Transit</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900 mt-2">14</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Hospital className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Delivered</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">1,247</p>
            </div>
          </div>
        </div>
          </>
        )}

        </>
        )}
      </main>
    </div>
    </>
  );
};

export default Index;
