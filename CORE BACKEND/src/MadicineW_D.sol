pragma solidity ^0.8.19;

import './Madicine.sol';

/********************************************** MadicineW_D ******************************************/
/// @title MadicineW_D
/// @notice Contract for managing medicine transfers between wholesaler and distributer
/// @dev Handles the tracking and transfer of medicine batches from wholesaler to distributer
contract MadicineW_D {
    /// @notice Contract owner address (wholesaler)
    address public immutable Owner;

    enum packageStatus { atcreator, picked, delivered }

    /// @notice Unique batch identifier
    address public immutable batchid;
    /// @notice Address of the sender (wholesaler)
    address public immutable sender;
    /// @notice Address of the shipper/transporter
    address public immutable shipper;
    /// @notice Address of the receiver (distributer)
    address public immutable receiver;
    /// @notice Current status of the package
    packageStatus public status;

    /// @notice Creates a new contract instance for medicine transfer
    /// @param BatchID Medicine Batch ID
    /// @param Sender Wholesaler Ethereum Network Address
    /// @param Shipper Transporter Ethereum Network Address
    /// @param Receiver Distributer Ethereum Network Address
    constructor(
        address BatchID,
        address Sender,
        address Shipper,
        address Receiver
    ) {
        require(BatchID != address(0), "Invalid batch ID");
        require(Sender != address(0), "Invalid sender address");
        require(Shipper != address(0), "Invalid shipper address");
        require(Receiver != address(0), "Invalid receiver address");

        Owner = Sender;
        batchid = BatchID;
        sender = Sender;
        shipper = Shipper;
        receiver = Receiver;
        status = packageStatus.atcreator;
    }

    /// @notice Initiates batch pickup by the assigned transporter
    /// @param BatchID Medicine Batch ID
    /// @param Shipper Transporter Ethereum Network Address
    function pickWD(address BatchID, address Shipper) external {
        require(
            Shipper == shipper,
            "Only Associated shipper can call this function."
        );
        require(
            BatchID == batchid,
            "Invalid batch ID"
        );
        require(
            status == packageStatus.atcreator,
            "Package must be at creator"
        );

        status = packageStatus.picked;

        Madicine(BatchID).sendWD(
            receiver,
            sender
        );
    }

    /// @notice Confirms batch receipt by the distributer
    /// @param BatchID Medicine Batch ID
    /// @param Receiver Distributer Ethereum Network Address
    function recieveWD(address BatchID, address Receiver) external {
        require(
            Receiver == receiver,
            "Only Associated receiver can call this function."
        );
        require(
            BatchID == batchid,
            "Invalid batch ID"
        );
        require(
            status == packageStatus.picked,
            "Package must be picked up first"
        );

        status = packageStatus.delivered;

        Madicine(BatchID).recievedWD(
            Receiver
        );
    }

    /// @notice Gets the current status of the batch transfer
    /// @dev Returns the numerical representation of the transfer status
    /// @return Current status of the transfer (0: at creator, 1: picked, 2: delivered)
    function getBatchIDStatus() external view returns(uint256) {
        return uint256(status);
    }
}