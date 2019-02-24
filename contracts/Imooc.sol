pragma solidity ^0.5.0;

contract CourseList {
    address public ceo;
    address[] public courses;
    constructor() public {
        ceo = msg.sender;
    }

    function createCourse(string memory _name) public {
        address newCourse = address(new Course(_name));
        courses.push(newCourse);
    }

    function getCourse() public view returns (address[] memory) {
        return courses;
    }
}

contract Course {
    string public name;
    constructor(string memory _name) public {
        name = _name;
    }
}