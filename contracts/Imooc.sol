pragma solidity ^0.5.0;

contract CourseList {
    address public ceo;

    constructor() public {
        ceo = msg.sender;
    }
}