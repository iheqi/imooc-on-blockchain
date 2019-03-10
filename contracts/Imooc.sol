pragma solidity ^0.5.0;

contract CourseList {
    address payable public ceo;
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
                ceo,
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
    address payable public ceo;
    address payable public owner;
    string public name;
    string public content;
    uint public price;
    uint public fundingPrice;
    uint public target;
    string public img;
    string public video;
    bool public isOnline;
    uint public count; 
    mapping (address => uint) public users;

    constructor(
        address payable _ceo,
        address payable _owner, 
        string memory _name, 
        string memory _content, 
        uint _price,
        uint _fundingPrice,
        uint _target,
        string memory _img
    ) public {
        ceo = _ceo;
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

    function addVideo(string memory _video) public {
        require(msg.sender == owner, "必须是讲师才能添加课程");
        require(isOnline, "课程必须已经上线");
        video = _video;
    }

    function buy() public payable {
        require(users[msg.sender] == 0, "不可重复购买");

        if (isOnline) {
            require(msg.value == price, "上线后必须以上线价格购买");
        } else {
            require(msg.value == fundingPrice, "未上线前用众筹价");
        }

        users[msg.sender] = msg.value;
        count++;

        if (target <= fundingPrice * count) {
            if (isOnline) {
                uint value = msg.value;
                ceo.transfer(value / 10);
                owner.transfer(value - (value / 10));
            } else { // 还没上线，第一次超出
                isOnline = true;
                owner.transfer(fundingPrice * count);
            }
        }
    }

    function getDetail() public view returns (string memory, string memory, uint, uint, uint, string memory, string memory, bool, uint, uint) {
        uint role = 2;
        if (msg.sender == owner) {
            role = 0;
        } else if (users[msg.sender] != 0) {
            role = 1;
        }
        return (
            name,
            content,
            price,
            fundingPrice,
            target,
            img,
            video,
            isOnline,
            count,  
            role
        );
    }
}