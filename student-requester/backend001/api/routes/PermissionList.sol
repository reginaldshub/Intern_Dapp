pragma solidity ^0.4.25;
contract PermissionList {  
    event addressregistered(address addy);
    address public deployer; // deployer is student
    string name; //name of the student
    enum State {Pending,Grant,Deny}
    struct Permission {
        State status;
        address requesterAddress; 
        string requesterName;
        uint32 requesterID;
    }
    mapping(address => Permission) public requesters;
    address[] public requesterAddresses;

    constructor( string _name ) public {
        deployer = msg.sender;
        name = _name;
    }
    
    function requestPermission(string _name, uint32 _id) public { 
        require(msg.sender!= deployer); // works only for requester
        requesterAddresses.push(msg.sender); 
        requesters[msg.sender].requesterName = _name; // name of the requester
        requesters[msg.sender].requesterID = _id; // id of the requester
        requesters[msg.sender].status = State.Pending;
        requesters[msg.sender].requesterAddress = msg.sender;
        emit addressregistered(msg.sender);
    }  
    function getAllRequesters() public constant returns(address[]) {
            require(msg.sender== deployer); // works only for student
            return requesterAddresses;
    }
    function grantPermission(address _tempAddress) public { 
        require(msg.sender== deployer); // works only for student
        if(requesters[_tempAddress].status == State.Pending)
           requesters[_tempAddress].status = State.Grant;
    }
    function denyPermission(address _tempAddress) public { 
        require(msg.sender== deployer); // works only for student
        if(requesters[_tempAddress].status == State.Pending)
           requesters[_tempAddress].status = State.Deny;
    }
    function getPermissionStatus() public view returns(State){
            require(msg.sender!= deployer); // called by requester to check status of his/her request
            return requesters[msg.sender].status;
    }
    function getPermissionStatus(address _tempAddress) public view returns(State){
            require(msg.sender== deployer); // called by student to check status provided for request
            return requesters[_tempAddress].status;
    }
}
