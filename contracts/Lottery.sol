pragma solidity ^0.4.17;


contract Lottery {
    address public organizer;
    address[] public participants;

    constructor() {
        organizer = msg.sender;
    }

    function buyTicket() public notOwner payable {
        require(msg.value > .001 ether);

        participants.push(msg.sender);
    }

    function getParticipants() public view returns (address[]) {
        return participants;
    }

    function drawLots() public onlyOwner payable {
        require(participants.length > 0);

        uint winningIndex = random() % participants.length;
        address winner = participants[winningIndex];

        winner.transfer(address(this).balance);
        resetState();
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(blockhash(block.number - 1), now)));
    }

    function resetState() private {
        participants = new address[](0); // Initial length is 0
    }

    modifier onlyOwner() {
        require(msg.sender == organizer);
        _;
    }

    modifier notOwner() {
        require(msg.sender != organizer);
        _;
    }
}