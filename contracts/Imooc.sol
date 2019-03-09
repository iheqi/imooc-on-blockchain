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
    }

    function getCourses() public view returns (address[] memory) {
        return courses;
    }

    function removeCourse(uint _index) public {
        require(msg.sender == ceo, "必须是ceo才能删除!");
        require(_index < courses.length && _index >= 0, "要删除的课程不存在!");
        delete courses[_index];

        uint len = courses.length;
        for (uint i = _index; i < len - 1; i++) {
            courses[i] = courses[i+1];
        }
        delete courses[len-1];
        courses.length--;
    }

    function isCeo() public view returns (bool) {
        return msg.sender == ceo;
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