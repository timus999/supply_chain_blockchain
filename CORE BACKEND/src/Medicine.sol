pragma solidity ^0.8.19;

/// @notice Contract for managing medicine batches in the pharmaceutical supply chain
/// @dev Handles the creation, tracking, and transfer of medicine batches between manufacturer and pharmacy
contract Medicine {
    /// @notice Contract owner address (manufacturer)
    address public immutable Owner;

    enum medicineStatus {
        atcreator, 
        readyForShipment, 
        picked, 
        delivered 
    }

    bytes32 public immutable description;
    bytes32 public immutable rawmaterials;
    uint256 public immutable quantity;
    address public immutable shipper;
    address public immutable manufacturer;
    address public pharmacy;
    medicineStatus public status;

    event ShipmentUpdate(
        address indexed BatchID,
        address indexed Shipper,
        address indexed Receiver,
        uint256 TransporterType,
        uint256 Status
    );


    constructor(
        address Manu,
        bytes32 Des,
        bytes32 RM,
        uint256 Quant,
        address Shpr,
        address Rcvr
    ) {
        require(Manu != address(0), "Invalid manufacturer address");
        require(Shpr != address(0), "Invalid shipper address");
        require(Rcvr != address(0), "Invalid receiver address");
        require(Quant > 0, "Quantity must be greater than 0");

        Owner = Manu;
        manufacturer = Manu;
        description = Des;
        rawmaterials = RM;
        quantity = Quant;
        shipper = Shpr;
        pharmacy = Rcvr;
        status = medicineStatus.atcreator;
    }


    function getMedicineInfo() external view returns(
        address Manu,
        bytes32 Des,
        bytes32 RM,
        uint256 Quant,
        address Shpr
    ) {
        return(
            manufacturer,
            description,
            rawmaterials,
            quantity,
            shipper
        );
    }

    function getMP() external view returns(address[2] memory MP) {
        return [manufacturer, pharmacy];
    }

    /// @notice Gets the current status of the medicine batch
    /// @dev Returns the numerical representation of the batch status
    /// @return Current status of the batch (0: at creator, 1: ready for shipment, 2: picked, 3: delivered)
    function getBatchIDStatus() external view returns(uint256) {
        return uint256(status);
    }

    /// @notice Marks the medicine batch as ready for shipment
    /// @dev Only the manufacturer can call this function to change status from atcreator to readyForShipment
    function markReadyForShipment() external {
        require(msg.sender == manufacturer, "Only the manufacturer can mark this batch ready for shipment.");
        require(status == medicineStatus.atcreator, "Batch must be at creator to be marked ready for shipment.");
        status = medicineStatus.readyForShipment;
        emit ShipmentUpdate(address(this), manufacturer, pharmacy, 1, uint256(status));
    }

    /// @notice Initiates batch pickup by the assigned transporter
    /// @dev Updates batch status to picked and emits shipment update event
    /// @param shpr 
    function pickPackage(address shpr) external {
        require(
            shpr == shipper,
            "Only Associate Shipper can call this function"
        );
        require(
            status == medicineStatus.readyForShipment,
            "Package must be ready for shipment."
        );

        status = medicineStatus.picked;
        emit ShipmentUpdate(address(this), shipper, pharmacy, 1, uint256(status));
    }


    function receivedPackage(address Rcvr) external {
        require(
            Rcvr == pharmacy,
            "Only Associate Pharmacy can call this function"
        );
        require(
            status == medicineStatus.picked,
            "Product not picked up yet"
        );

        status = medicineStatus.delivered;
        emit ShipmentUpdate(address(this), shipper, pharmacy, 2, uint256(status));
    }
}
