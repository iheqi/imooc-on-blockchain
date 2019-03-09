pragma solidity ^0.5.0;

contract CourseList {
    address public ceo;
    address[] public courses;
    constructor() public {
        ceo = msg.sender;
    }


    function createCourse(string memory _name) public returns (address) {
        address newCourse = address(new Course(_name));
        courses.push(newCourse);
        return newCourse;
    }

    function getCourses() public view returns (address[] memory) {
        return courses;
    }
}

contract Course {
    string public name;

    constructor(string memory _name) public {
        name = _name;
    }

    function getName() public view returns (string memory) {
        return name;
    }
}