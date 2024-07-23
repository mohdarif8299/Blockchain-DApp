// DigitalObjectIdentifier.sol
pragma solidity ^0.8.10;

contract DigitalObjectIdentifier {
    mapping(uint256 => string) private objects;
    uint256 private objectCount;

    function registerObject(string memory _data) public {
        objectCount++;
        objects[objectCount] = _data;
    }

    function getObject(uint256 _id) public view returns (string memory) {
        require(_id > 0 && _id <= objectCount, "Invalid object ID");
        return objects[_id];
    }

    function getObjectCount() public view returns (uint256) {
        return objectCount;
    }
}