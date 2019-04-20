pragma solidity ^0.5.0;

contract Imooc {
    address payable public admin;
    address[] public teachers;
    address[] public courses;
    bytes23[] public questions; // 每两个为一个问题的内容
    constructor() public {
        admin = msg.sender;
    }

    function addTeacher(string memory teacher) public returns (bool) {
        require(msg.sender == admin, "必须是admin才能添加讲师!");
        address teacherAddress = parseAddr(teacher);
        
        if (isTeacher(teacherAddress) == true) { // 添加的讲师已存在
            return false;
        }

        teachers.push(teacherAddress);
        return true;
    }

    function isTeacher(address teacher) public view returns (bool) {
        uint len = teachers.length;
        for (uint i = 0; i < len; i++) { 
            if (teachers[i] == teacher) {
                return true;
            }
        }
        return false;
    }
    function getTeachers() public view returns (address[] memory) {
        return teachers;
    }
    function removeTeacher(uint _index) public {
        require(msg.sender == admin, "必须是admin才能删除讲师!");
        require(_index < teachers.length && _index >= 0, "要删除的讲师不存在!");
        delete teachers[_index];

        uint len = teachers.length;
        for (uint i = _index; i < len - 1; i++) {
            teachers[i] = teachers[i+1];
        }
        delete teachers[len-1];
        teachers.length--;
    }

    function parseAddr(string memory _a) public pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }


    function createCourse(
        string memory name,
        string memory content,
        uint price,
        uint fundingPrice,
        uint target,
        string memory img
    ) public returns (address) {
        require(isTeacher(msg.sender), "必须是讲师才能创建课程");
        address newCourse = address(
            new Course(
                admin,
                msg.sender,
                name, 
                content, 
                price, 
                fundingPrice, 
                target, 
                img,
                true // 是否众筹
            ));
        courses.push(newCourse);
    }

    function createOnlineCourse(
        string memory name,
        string memory content,
        uint price,
        string memory img
    ) public returns (address) {
        require(isTeacher(msg.sender), "必须是讲师才能创建课程");

        address newCourse = address(
            new Course(
                admin,
                msg.sender,
                name, 
                content, 
                price, 
                0, // 对于直接上线的课程，fundingPrice和target为0
                0, 
                img,
                false
            ));
        courses.push(newCourse);
    }

    function getCourses() public view returns (address[] memory) {
        return courses;
    }

    function removeCourse(uint _index) public {
        require(msg.sender == admin, "必须是admin才能删除!");
        require(_index < courses.length && _index >= 0, "要删除的课程不存在!");
        delete courses[_index];

        uint len = courses.length;
        for (uint i = _index; i < len - 1; i++) {
            courses[i] = courses[i+1];
        }
        delete courses[len-1];
        courses.length--;
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }

    function createQa(bytes23 hash1, bytes23 hash2) public {
        questions.push(hash1);
        questions.push(hash2);
    }

    function getQa() public view returns (bytes23[] memory)  {
        return questions;
    }

    function updateQa(uint index, bytes23 hash1, bytes23 hash2) public {
        questions[index * 2] = hash1;
        questions[index * 2 + 1] = hash2;
    }

    function removeQa(uint index) public {
        uint len = questions.length;

        for (uint i = index * 2; i < len - 2; i = i + 2) {
            questions[i] = questions[i+2];
            questions[i+1] = questions[i+3];
        }
        delete questions[len-1];
        delete questions[len-2];
        questions.length = questions.length - 2;
    }
}

contract Course {
    address payable public admin;
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

    uint public fundingEnd;
    bytes23[] public comments;

    constructor(
        address payable _admin,
        address payable _owner, 
        string memory _name, 
        string memory _content, 
        uint _price,
        uint _fundingPrice,
        uint _target,
        string memory _img,
        bool isFunding
    ) public {
        admin = _admin;
        owner = _owner;
        name = _name;
        content = _content;
        price = _price;
        fundingPrice = _fundingPrice;
        target = _target;
        img = _img;
        video = "";
        count = 0; 

        fundingEnd = now + 30 * 24 * 60 * 60;

        if (isFunding) {
            isOnline = false;
        } else {
            isOnline = true;
        }
    }

    function addVideo(string memory _video) public {
        require(msg.sender == owner, "必须是讲师才能添加课程");
        require(isOnline, "课程必须已经上线");
        video = _video;
    }

    function buy() public payable {
        require(users[msg.sender] == 0, "不可重复购买"); // 映射中不存在的键，对应的值为0

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
                admin.transfer(value / 10);
                owner.transfer(value - (value / 10));
            } else { // 还没上线，第一次超出
                isOnline = true;
                owner.transfer(fundingPrice * count);
            }
        }
    }

    function getDetail() public view returns (string memory, string memory, uint, uint, uint, string memory, string memory, bool, uint, uint) {
        uint role = 2; // 未购买者
        if (msg.sender == owner) { // 讲师
            role = 0;
        } else if (users[msg.sender] != 0) { // 已购买的学员
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

    function withdrew() public returns (bool) {
        if (now > fundingEnd) {
            if (users[msg.sender] != 0) {
                msg.sender.transfer(users[msg.sender]);
                users[msg.sender] = 0;
                count--;
                return true;
            }
        }
        return false;
    }

    function createEvaluate(bytes23 hash1, bytes23 hash2) public {
        comments.push(hash1);
        comments.push(hash2);
    }

    function getEvaluates() public view returns (bytes23[] memory)  {
        return comments;
    }

    function updateEvaluate(uint index, bytes23 hash1, bytes23 hash2) public {
        comments[index * 2] = hash1;
        comments[index * 2 + 1] = hash2;
    }

    function removeEvaluate(uint index) public {
        uint len = comments.length;

        for (uint i = index * 2; i < len - 2; i = i + 2) {
            comments[i] = comments[i+2];
            comments[i+1] = comments[i+3];
        }
        delete comments[len-1];
        delete comments[len-2];
        comments.length = comments.length - 2;
    }
}