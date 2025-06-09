pragma solidity ^0.8.19;

import './RawMatrials.sol';
import './Madicine.sol';
import './MadicineW_D.sol';
import './MadicineD_P.sol';

/// @title Blockchain : Pharmaceutical SupplyChain
/// @notice Main contract for managing the pharmaceutical supply chain
/// @dev Handles user roles, raw materials, medicine batches, and their transfers between different supply chain participants
/// @author 
contract SupplyChain {

    /// @notice Contract owner address
    address public immutable Owner;

    /// @notice Initializes the supply chain contract
    /// @dev Sets the contract deployer as the owner
    constructor() {
        Owner = msg.sender;
    }
/********************************************** Owner Section *********************************************/
    /// @notice Restricts function access to contract owner only
    modifier onlyOwner() {
        require(
            msg.sender == Owner,
            "Only owner can call this function."
        );
        _;
    }

    enum roles {
        norole,
        supplier,
        transporter,
        manufacturer,
        wholesaler,
        distributer,
        pharma,
        revoke
    }

    event UserRegister(address indexed EthAddress, bytes32 Name);
    event UserRoleRevoked(address indexed EthAddress, bytes32 Name, uint256 Role);
    event UserRoleRessigne(address indexed EthAddress, bytes32 Name, uint256 Role);

    /// @notice Registers a new user in the supply chain
    /// @dev Adds a new user with specified role and details
    /// @param EthAddress Ethereum Network Address of User
    /// @param Name User name
    /// @param Location User Location
    /// @param Role User Role (0-7 representing different roles)
    function registerUser(
        address EthAddress,
        bytes32 Name,
        bytes32 Location,
        uint256 Role
    ) external onlyOwner {
        require(UsersDetails[EthAddress].role == roles.norole, "User Already registered");
        require(Role < uint256(roles.revoke), "Invalid role");
        UsersDetails[EthAddress].name = Name;
        UsersDetails[EthAddress].location = Location;
        UsersDetails[EthAddress].ethAddress = EthAddress;
        UsersDetails[EthAddress].role = roles(Role);
        users.push(EthAddress);
        emit UserRegister(EthAddress, Name);
    }
    /// @notice Revokes a user's role in the supply chain
    /// @dev Sets user's role to revoked (7)
    /// @param userAddress User Ethereum Network Address
    function revokeRole(address userAddress) external onlyOwner {
        require(UsersDetails[userAddress].role != roles.norole, "User not registered");
        emit UserRoleRevoked(userAddress, UsersDetails[userAddress].name, uint256(UsersDetails[userAddress].role));
        UsersDetails[userAddress].role = roles.revoke;
    }
    /// @notice Reassigns a new role to an existing user
    /// @dev Updates user's role to the specified new role
    /// @param userAddress User Ethereum Network Address
    /// @param Role New role to assign (0-7)
    function reassigneRole(address userAddress, uint256 Role) external onlyOwner {
        require(UsersDetails[userAddress].role != roles.norole, "User not registered");
        require(Role < uint256(roles.revoke), "Invalid role");
        UsersDetails[userAddress].role = roles(Role);
        emit UserRoleRessigne(userAddress, UsersDetails[userAddress].name, uint256(UsersDetails[userAddress].role));
    }

/********************************************** User Section **********************************************/
    struct UserInfo {
        bytes32 name;
        bytes32 location;
        address ethAddress;
        roles role;
    }

    /// @notice Mapping of user addresses to their information
    mapping(address => UserInfo) public UsersDetails;
    /// @notice Array of all registered user addresses
    address[] private users;

    /// @notice Retrieves user information
    /// @dev Returns the complete profile of a registered user
    /// @param User User Ethereum Network Address
    /// @return name User's name
    /// @return location User's location
    /// @return ethAddress User's Ethereum address
    /// @return role User's role in the supply chain
    function getUserInfo(address User) public view returns(
        bytes32 name,
        bytes32 location,
        address ethAddress,
        roles role
    ) {
        return (
            UsersDetails[User].name,
            UsersDetails[User].location,
            UsersDetails[User].ethAddress,
            UsersDetails[User].role
        );
    }

    /// @notice Gets the total number of registered users
    /// @dev Returns the length of the users array
    /// @return count Total number of registered users
    function getUsersCount() external view returns(uint256 count) {
        return users.length;
    }

    /// @notice Retrieves user information by index
    /// @dev Returns user details at the specified index in the users array
    /// @param index Index in the users array
    /// @return name User's name
    /// @return location User's location
    /// @return ethAddress User's Ethereum address
    /// @return role User's role in the supply chain
    function getUserbyIndex(uint256 index) external view returns(
        bytes32 name,
        bytes32 location,
        address ethAddress,
        roles role
    ) {
        require(index < users.length, "Index out of bounds");
        return getUserInfo(users[index]);
    }
                         //             Supplier Section 
    /// @notice Mapping of supplier addresses to their raw product package addresses
    mapping(address => address[]) supplierRawProductInfo;
    event RawSupplyInit(
        address indexed ProductID,
        address indexed Supplier,
        address Shipper,
        address indexed Receiver
    );

    /// @notice Creates a new raw materials package
    /// @param Des Description of raw materials
    /// @param FN Farmer's name
    /// @param Loc Farm location
    /// @param Quant Quantity of raw materials
    /// @param Shpr Transporter Ethereum Network Address
    /// @param Rcvr Manufacturer Ethereum Network Address
    function createRawPackage(
        bytes32 Des,
        bytes32 FN,
        bytes32 Loc,
        uint256 Quant,
        address Shpr,
        address Rcvr
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.supplier,
            "Only Supplier Can call this function"
        );
        require(Shpr != address(0), "Invalid shipper address");
        require(Rcvr != address(0), "Invalid receiver address");
        require(Quant > 0, "Quantity must be greater than 0");

        RawMatrials rawData = new RawMatrials(
            msg.sender,
            Des,
            FN,
            Loc,
            Quant,
            Shpr,
            Rcvr
        );
        supplierRawProductInfo[msg.sender].push(address(rawData));
        emit RawSupplyInit(address(rawData), msg.sender, Shpr, Rcvr);
    }

    /// @notice Gets the count of packages created by the supplier
    /// @return count Number of packages created
    function getPackagesCountS() external view returns (uint256) {
        require(
            UsersDetails[msg.sender].role == roles.supplier,
            "Only Supplier Can call this function"
        );
        return supplierRawProductInfo[msg.sender].length;
    }

    /// @notice Gets a package ID by its index
    /// @param index Index in the supplier's package array
    /// @return packageID Address of the raw materials package
    function getPackageIdByIndexS(uint256 index) external view returns(address) {
        require(
            UsersDetails[msg.sender].role == roles.supplier,
            "Only Supplier Can call this function"
        );
        require(index < supplierRawProductInfo[msg.sender].length, "Index out of bounds");
        return supplierRawProductInfo[msg.sender][index];
    }

/********************************************** Transporter Section ******************************************/

    /// @notice Loads a consignment for transport
    /// @param pid Package or Medicine Batch ID
    /// @param transportertype Type of transport (1-4 representing different transfer types)
    /// @param cid Sub Contract ID for the consignment transaction
    function loadConsingment(
        address pid,
        uint256 transportertype,
        address cid
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.transporter,
            "Only Transporter can call this function"
        );
        require(pid != address(0), "Invalid package ID");
        require(transportertype > 0 && transportertype <= 4, "Invalid transporter type");

        if(transportertype == 1) {
            RawMatrials(pid).pickPackage(msg.sender);
        } else if(transportertype == 2) {
            Madicine(pid).pickPackage(msg.sender);
        } else if(transportertype == 3) {
            require(cid != address(0), "Invalid contract ID");
            MadicineW_D(cid).pickWD(pid, msg.sender);
        } else if(transportertype == 4) {
            require(cid != address(0), "Invalid contract ID");
            MadicineD_P(cid).pickDP(pid, msg.sender);
        }
    }

/********************************************** Manufacturer Section ******************************************/
    /// @notice Mapping of manufacturer addresses to their received raw package addresses
    mapping(address => address[]) RawPackagesAtManufacturer;

    /// @notice Confirms receipt of raw materials package
    /// @param pid Package ID of the raw materials
    function rawPackageReceived(address pid) external {
        require(
            UsersDetails[msg.sender].role == roles.manufacturer,
            "Only manufacturer can call this function"
        );
        require(pid != address(0), "Invalid package ID");

        RawMatrials(pid).receivedPackage(msg.sender);
        RawPackagesAtManufacturer[msg.sender].push(pid);
    }

    /// @notice Gets the count of packages received by the manufacturer
    /// @return count Number of packages received
    function getPackagesCountM() external view returns(uint256) {
        require(
            UsersDetails[msg.sender].role == roles.manufacturer,
            "Only manufacturer can call this function"
        );
        return RawPackagesAtManufacturer[msg.sender].length;
    }

    /// @notice Gets a package ID by its index
    /// @param index Index in the manufacturer's package array
    /// @return packageID Address of the raw materials package
    function getPackageIDByIndexM(uint256 index) external view returns(address) {
        require(
            UsersDetails[msg.sender].role == roles.manufacturer,
            "Only manufacturer can call this function"
        );
        require(index < RawPackagesAtManufacturer[msg.sender].length, "Index out of bounds");
        return RawPackagesAtManufacturer[msg.sender][index];
    }

    /// @notice Mapping of manufacturer addresses to their received medicine batch addresses
    mapping(address => address[]) ManufactureredMadicineBatches;
    event MadicineNewBatch(
        address indexed BatchId,
        address indexed Manufacturer,
        address shipper,
        address indexed Receiver
    );

    /// @notice Creates a new medicine batch
    /// @param Des Description of medicine batch
    /// @param RM RawMatrials Information
    /// @param Quant Number of Units
    /// @param Shpr Transporter Ethereum Network Address
    /// @param Rcvr Receiver Ethereum Network Address
    /// @param RcvrType Receiver Type Either Wholesaler(1) or Distributer(2)
    function manufacturMadicine(
        bytes32 Des,
        bytes32 RM,
        uint256 Quant,
        address Shpr,
        address Rcvr,
        uint256 RcvrType
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.manufacturer,
            "Only manufacturer can call this function"
        );
        require(Shpr != address(0), "Invalid shipper address");
        require(Rcvr != address(0), "Invalid receiver address");
        require(Quant > 0, "Quantity must be greater than 0");
        require(RcvrType == 1 || RcvrType == 2, "Invalid receiver type");

        Madicine m = new Madicine(
            msg.sender,
            Des,
            RM,
            Quant,
            Shpr,
            Rcvr,
            RcvrType
        );

        ManufactureredMadicineBatches[msg.sender].push(address(m));
        emit MadicineNewBatch(address(m), msg.sender, Shpr, Rcvr);
    }

    /// @notice Gets the count of medicine batches received by the manufacturer
    /// @return count Number of batches received
    function getBatchesCountM() external view returns (uint256) {
        require(
            UsersDetails[msg.sender].role == roles.manufacturer,
            "Only Manufacturer Can call this function"
        );
        return ManufactureredMadicineBatches[msg.sender].length;
    }

    /// @notice Gets a medicine batch ID by its index
    /// @param index Index in the manufacturer's batch array
    /// @return packageID Address of the medicine batch
    function getBatchIdByIndexM(uint256 index) external view returns(address) {
        require(
            UsersDetails[msg.sender].role == roles.manufacturer,
            "Only Manufacturer Can call this function"
        );
        require(index < ManufactureredMadicineBatches[msg.sender].length, "Index out of bounds");
        return ManufactureredMadicineBatches[msg.sender][index];
    }


/********************************************** Wholesaler Section ******************************************/
    /// @notice Mapping of wholesaler addresses to their received medicine batch addresses
    mapping(address => address[]) MadicineBatchesAtWholesaler;
    mapping(address => address[]) MadicineBatchesAtDistributor;

    /// @notice Confirms receipt of medicine batch
    /// @param batchid Medicine BatchID
    /// @param cid Sub Contract ID for Medicine (if transaction Wholesaler to Distributer)
    function madicineReceived(
        address batchid,
        address cid
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.wholesaler || UsersDetails[msg.sender].role == roles.distributer,
            "Only Wholesaler and Distributer can call this function"
        );
        require(batchid != address(0), "Invalid batch ID");

        uint256 rtype = Madicine(batchid).receivedPackage(msg.sender);
        if(rtype == 1) {
            MadicineBatchesAtWholesaler[msg.sender].push(batchid);
        } else if(rtype == 2) {
            if(Madicine(batchid).getWDP()[0] != address(0)) {
                require(cid != address(0), "Invalid contract ID");
                MadicineW_D(cid).recieveWD(batchid, msg.sender);
            }
            MadicineBatchesAtDistributor[msg.sender].push(batchid);
        }
    }

    /// @notice Mapping of wholesaler addresses to their received medicine batch addresses
    mapping(address => address[]) MadicineWtoD;
    /// @notice Mapping of wholesaler addresses to their received medicine batch transaction contracts
    mapping(address => address) MadicineWtoDTxContract;

    /// @notice Creates a new sub contract for medicine transfer from wholesaler to distributer
    /// @param BatchID Medicine BatchID
    /// @param Shipper Transporter Ethereum Network Address
    /// @param Receiver Distributer Ethereum Network Address
    function transferMadicineWtoD(
        address BatchID,
        address Shipper,
        address Receiver
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.wholesaler &&
            msg.sender == Madicine(BatchID).getWDP()[0],
            "Only Wholesaler or current owner of package can call this function"
        );
        require(BatchID != address(0), "Invalid batch ID");
        require(Shipper != address(0), "Invalid shipper address");
        require(Receiver != address(0), "Invalid receiver address");

        MadicineW_D wd = new MadicineW_D(
            BatchID,
            msg.sender,
            Shipper,
            Receiver
        );
        MadicineWtoD[msg.sender].push(address(wd));
        MadicineWtoDTxContract[BatchID] = address(wd);
    }

    /// @notice Gets the count of medicine batches received by the wholesaler
    /// @return count Number of batches received
    function getBatchesCountWD() external view returns (uint256) {
        require(
            UsersDetails[msg.sender].role == roles.wholesaler,
            "Only Wholesaler Can call this function"
        );
        return MadicineWtoD[msg.sender].length;
    }

    /// @notice Gets a medicine batch ID by its index
    /// @param index Index in the wholesaler's batch array
    /// @return packageID Address of the medicine batch
    function getBatchIdByIndexWD(uint256 index) external view returns(address) {
        require(
            UsersDetails[msg.sender].role == roles.wholesaler,
            "Only Wholesaler Can call this function"
        );
        require(index < MadicineWtoD[msg.sender].length, "Index out of bounds");
        return MadicineWtoD[msg.sender][index];
    }

    /// @notice Gets the sub contract ID of medicine batch transfer in between wholesaler to distributer
    /// @param BatchID Medicine BatchID
    /// @return SubContractWD Sub contract ID
    function getSubContractWD(address BatchID) external view returns (address) {
        require(BatchID != address(0), "Invalid batch ID");
        return MadicineWtoDTxContract[BatchID];
    }

/********************************************** Distributer Section ******************************************/
    /// @notice Mapping of distributer addresses to their received medicine batch addresses
    mapping(address => address[]) MadicineBatchAtDistributer;


    /// @notice Mapping of distributer addresses to their received medicine batch transaction contracts
    mapping(address => address) MadicineDtoPTxContract;

    /// @notice Creates a new sub contract for medicine transfer from distributer to pharma
    /// @param BatchID Medicine BatchID
    /// @param Shipper Transporter Ethereum Network Address
    /// @param Receiver Pharma Ethereum Network Address
    function transferMadicineDtoP(
        address BatchID,
        address Shipper,
        address Receiver
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.distributer &&
            msg.sender == Madicine(BatchID).getWDP()[1],
            "Only Distributer or current owner of package can call this function"
        );
        require(BatchID != address(0), "Invalid batch ID");
        require(Shipper != address(0), "Invalid shipper address");
        require(Receiver != address(0), "Invalid receiver address");

        MadicineD_P dp = new MadicineD_P(
            BatchID,
            msg.sender,
            Shipper,
            Receiver
        );
        MadicineBatchesAtDistributor[msg.sender].push(address(dp));
        MadicineDtoPTxContract[BatchID] = address(dp);
    }

    /// @notice Gets the count of medicine batches received by the distributer
    /// @return count Number of batches received
    function getBatchesCountDP() external view returns (uint256) {
        require(UsersDetails[msg.sender].role == roles.distributer, "Only Distributor Can call this function");
        return MadicineBatchesAtDistributor[msg.sender].length;
    }

    /// @notice Gets a medicine batch ID by its index
    /// @param index Index in the distributer's batch array
    /// @return packageID Address of the medicine batch
    function getBatchIdByIndexDP(uint256 index) external view returns(address) {
        require(UsersDetails[msg.sender].role == roles.distributer, "Only Distributor Can call this function");
        require(index < MadicineBatchesAtDistributor[msg.sender].length, "Index out of bounds");
        return MadicineBatchesAtDistributor[msg.sender][index];
    }

    /// @notice Gets the sub contract ID of medicine batch transfer in between distributer to pharma
    /// @param BatchID Medicine BatchID
    /// @return SubContractDP Sub contract ID
    function getSubContractDP(address BatchID) external view returns (address) {
        require(BatchID != address(0), "Invalid batch ID");
        return MadicineDtoPTxContract[BatchID];
    }

/********************************************** Pharma Section ******************************************/
    /// @notice Mapping of pharma addresses to their received medicine batch addresses
    mapping(address => address[]) MadicineBatchAtPharma;

    /// @notice Confirms receipt of medicine batch
    /// @param batchid Medicine BatchID
    /// @param cid SubContract ID
    function madicineRecievedAtPharma(
        address batchid,
        address cid
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.pharma,
            "Only Pharma Can call this function"
        );
        require(batchid != address(0), "Invalid batch ID");
        require(cid != address(0), "Invalid contract ID");

        MadicineD_P(cid).recieveDP(batchid, msg.sender);
        MadicineBatchAtPharma[msg.sender].push(batchid);
        sale[batchid] = salestatus.atpharma;
    }

    enum salestatus {
        notfound,
        atpharma,
        sold,
        expire,
        damaged
    }

    /// @notice Mapping of medicine batch IDs to their status
    mapping(address => salestatus) sale;

    event MadicineStatus(
        address BatchID,
        address indexed Pharma,
        uint256 status
    );

    /// @notice Updates the status of a medicine batch
    /// @param BatchID Medicine BatchID
    /// @param Status Medicine Batch Status (sold, expire etc.)
    function updateSaleStatus(
        address BatchID,
        uint256 Status
    ) external {
        require(
            UsersDetails[msg.sender].role == roles.pharma &&
            msg.sender == Madicine(BatchID).getWDP()[2],
            "Only Pharma or current owner of package can call this function"
        );
        require(BatchID != address(0), "Invalid batch ID");
        require(Status > uint256(salestatus.notfound) && Status <= uint256(salestatus.damaged), "Invalid status");
        require(sale[BatchID] == salestatus.atpharma, "Medicine must be at Pharma");
        
        sale[BatchID] = salestatus(Status);
        emit MadicineStatus(BatchID, msg.sender, Status);
    }

    /// @notice Gets the status of a medicine batch
    /// @param BatchID Medicine BatchID
    /// @return Status Medicine Batch Status
    function salesInfo(address BatchID) external view returns(uint256) {
        require(BatchID != address(0), "Invalid batch ID");
        return uint256(sale[BatchID]);
    }

    /// @notice Gets the count of medicine batches received by the pharma
    /// @return count Number of batches received
    function getBatchesCountP() external view returns(uint256) {
        require(
            UsersDetails[msg.sender].role == roles.pharma,
            "Only Pharma can call this function"
        );
        return MadicineBatchAtPharma[msg.sender].length;
    }

    /// @notice Gets a medicine batch ID by its index
    /// @param index Index in the pharma's batch array
    /// @return BatchID Address of the medicine batch
    function getBatchIdByIndexP(uint256 index) external view returns(address) {
        require(
            UsersDetails[msg.sender].role == roles.pharma,
            "Only Pharma can call this function"
        );
        require(index < MadicineBatchAtPharma[msg.sender].length, "Index out of bounds");
        return MadicineBatchAtPharma[msg.sender][index];
    }
}
