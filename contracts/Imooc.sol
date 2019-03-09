pragma solidity ^0.5.0;

contract CourseList {
    address public ceo;
    address[] public courses;
    constructor() public {
        ceo = msg.sender;
    }

    function createCourse(
        string memory name,
        string memory content,
        uint price,
        uint fundingPrice,
        uint target,
        string memory img
    ) public returns (address) {
        address newCourse = address(
            new Course(
                msg.sender,
                name, 
                content, 
                price, 
                fundingPrice, 
                target, 
                img
            ));
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
    address public owner;
    string public name;
    string public content;
    uint public price;
    uint public fundingPrice;
    uint public target;
    string public img;
    string public video;
    bool public isOnline;
    uint public count; 

    constructor(
        address _owner, 
        string memory _name, 
        string memory _content, 
        uint _price,
        uint _fundingPrice,
        uint _target,
        string memory _img
    ) public {
        owner = _owner;
        name = _name;
        content = _content;
        price = _price;
        fundingPrice = _fundingPrice;
        target = _target;
        img = _img;
        video = "";
        isOnline = false;
        count = 0; 
    }

    function getName() public view returns (string memory) {
        return name;
    }
}