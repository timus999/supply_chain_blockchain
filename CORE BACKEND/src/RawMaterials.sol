pragma solidity ^0.8.19;

                    // rawmaterials 
/// @title RawMaterials
/// @notice Contract for managing raw materials in the pharmaceutical supply chain

contract RawMaterials {
    /// @notice Contract owner address
    address public immutable Owner;

    enum packageStatus { atcreator, picked, delivered }
    
    event ShippmentUpdate(
        address indexed BatchID,
        address indexed Shipper,
        address indexed Manufacturer,
        uint256 TransporterType,
        uint256 Status
    );

    /// @notice Unique product identifier
    address public immutable productid;
    /// @notice Description of the raw materials
    bytes32 public immutable description;
    /// @notice Name of the farmer supplying the materials
    bytes32 public immutable farmer_name;
    /// @notice Location of the farm
    bytes32 public immutable location;
    /// @notice Quantity of raw materials
    uint256 public immutable quantity;
    /// @notice Address of the shipper/transporter
    address public immutable shipper;
    /// @notice Address of the manufacturer
    address public immutable manufacturer;
    /// @notice Address of the supplier
    address public immutable supplier;
    /// @notice Current status of the package
    packageStatus public status;
    /// @notice Description for the package receiver
    bytes32 public packageReceiverDescription;

    /// @notice Creates a new raw materials package

    /// @param Splr Supplier Ethereum Network Address
    /// @param Des Description of Raw Materials
    /// @param FN Farmer Name
    /// @param Loc Farm Location
    /// @param Quant Number of units in a package
    /// @param Shpr Transporter Ethereum Network Address
    /// @param Rcvr Manufacturer Ethereum Network Address
    constructor(
        address Splr,
        bytes32 Des,
        bytes32 FN,
        bytes32 Loc,
        uint256 Quant,
        address Shpr,
        address Rcvr
    ) {
        require(Splr != address(0), "Invalid supplier address");
        require(Shpr != address(0), "Invalid shipper address");
        require(Rcvr != address(0), "Invalid manufacturer address");
        require(Quant > 0, "Quantity must be greater than 0");
        
        Owner = Splr;
        productid = address(this);
        description = Des;
        farmer_name = FN;
        location = Loc;
        quantity = Quant;
        shipper = Shpr;
        manufacturer = Rcvr;
        supplier = Splr;
        status = packageStatus.atcreator;
    }

    /// @notice Retrieves the details of the supplied raw materials
  
    /// @return Des Description of the raw materials
    /// @return FN Farmer's name
    /// @return Loc Farm location
    /// @return Quant Quantity of materials
    /// @return Shpr Shipper's address
    /// @return Rcvr Manufacturer's address
    /// @return Splr Supplier's address
    function getSuppliedRawMaterials() external view returns(
        bytes32 Des,
        bytes32 FN,
        bytes32 Loc,
        uint256 Quant,
        address Shpr,
        address Rcvr,
        address Splr
    ) {
        return(
            description,
            farmer_name,
            location,
            quantity,
            shipper,
            manufacturer,
            supplier
        );
    }

    /// @notice Gets the current status of the raw materials package
    /// @dev Returns the numerical representation of the package status
    /// @return Current status of the package (0: at creator, 1: picked, 2: delivered)
    function getRawMaterialsStatus() external view returns(uint256) {
        return uint256(status);
    }

    /// @notice Initiates package pickup by the assigned transporter
    /// @param shpr Transporter Ethereum Network Address
    function pickPackage(address shpr) external {
        require(
            shpr == shipper,
            "Only Associate Shipper can call this function"
        );
        require(
            status == packageStatus.atcreator,
            "Package must be at Supplier."
        );
        status = packageStatus.picked;
        emit ShippmentUpdate(address(this), shipper, manufacturer, 1, 1);
    }

    /// @notice Confirms package receipt by the manufacturer
    /// @param manu Manufacturer Ethereum Network Address
    function receivedPackage(address manu) external {
        require(
            manu == manufacturer,
            "Only Associate Manufacturer can call this function"
        );
        require(
            status == packageStatus.picked,
            "Product not picked up yet"
        );
        status = packageStatus.delivered;
        emit ShippmentUpdate(address(this), shipper, manufacturer, 1, 2);
    }
}
