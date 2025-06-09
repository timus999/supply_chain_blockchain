export const supplyChainContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "BatchId",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "Manufacturer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "shipper",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "Receiver",
				"type": "address"
			}
		],
		"name": "MadicineNewBatch",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "BatchID",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "Pharma",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "status",
				"type": "uint256"
			}
		],
		"name": "MadicineStatus",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "ProductID",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "Supplier",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "Shipper",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "Receiver",
				"type": "address"
			}
		],
		"name": "RawSupplyInit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "EthAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "Name",
				"type": "bytes32"
			}
		],
		"name": "UserRegister",
		"type": "event"
	},
	{	
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "EthAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "Name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "Role",
				"type": "uint256"
			}
		],
		"name": "UserRoleRessigne",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "EthAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "Name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "Role",
				"type": "uint256"
			}
		],
		"name": "UserRoleRevoked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "Owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "UsersDetails",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "location",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "ethAddress",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.roles",
				"name": "role",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "Des",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "FN",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "Loc",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "Quant",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "Shpr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "Rcvr",
				"type": "address"
			}
		],
		"name": "createRawPackage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getBatchIdByIndexDP",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getBatchIdByIndexM",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",	
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getBatchIdByIndexP",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getBatchIdByIndexWD",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBatchesCountDP",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBatchesCountM",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBatchesCountP",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBatchesCountWD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPackageIDByIndexM",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPackageIdByIndexS",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPackagesCountM",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPackagesCountS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "BatchID",
				"type": "address"
			}
		],
		"name": "getSubContractDP",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "BatchID",
				"type": "address"
			}
		],
		"name": "getSubContractWD",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "User",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "location",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "ethAddress",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.roles",
				"name": "role",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getUserbyIndex",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "location",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "ethAddress",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.roles",
				"name": "role",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUsersCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "pid",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "transportertype",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "cid",
				"type": "address"
			}
		],
		"name": "loadConsingment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "batchid",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "cid",
				"type": "address"
			}
		],
		"name": "madicineReceived",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "batchid",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "cid",
				"type": "address"
			}
		],
		"name": "madicineRecievedAtPharma",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "Des",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "RM",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "Quant",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "Shpr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "Rcvr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "RcvrType",
				"type": "uint256"
			}
		],
		"name": "manufacturMadicine",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "pid",
				"type": "address"
			}
		],
		"name": "rawPackageReceived",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "Role",
				"type": "uint256"
			}
		],
		"name": "reassigneRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "EthAddress",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "Name",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "Location",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "Role",
				"type": "uint256"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "BatchID",
				"type": "address"
			}
		],
		"name": "salesInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "BatchID",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "Shipper",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "Receiver",
				"type": "address"
			}
		],
		"name": "transferMadicineDtoP",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "BatchID",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "Shipper",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "Receiver",
				"type": "address"
			}
		],
		"name": "transferMadicineWtoD",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "BatchID",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "Status",
				"type": "uint256"
			}
		],
		"name": "updateSaleStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; 