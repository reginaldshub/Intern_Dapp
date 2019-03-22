pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;
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
    
    struct file {
        string folderName;
        string fileName;
        string iPFSHash;
    }
    file public secFiles;
    file public hsecFiles;
    file public gradFiles;
    file public postgradFiles;

    
    address[] public requesterAddresses;

    constructor( string _name ) public {
        deployer = msg.sender;
        name = _name;
    }
    event GrantEvent(address _requester, State _status);
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
        if(requesters[_tempAddress].status == State.Pending){
           requesters[_tempAddress].status = State.Grant;
            emit GrantEvent(_tempAddress, State.Grant);
        }
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
    
    function add10thFile(string fileName, string hash) public{
        require(msg.sender== deployer); // works only for student
        secFiles.fileName = fileName;
        secFiles.iPFSHash = hash;
    }
    function add12thFile(string fileName, string hash) public{
        require(msg.sender== deployer); // works only for student
        hsecFiles.fileName = fileName;
        hsecFiles.iPFSHash = hash;
    }
    function addGradFile(string fileName, string hash) public{
        require(msg.sender== deployer); // works only for student
        gradFiles.fileName = fileName;
        gradFiles.iPFSHash = hash;
    }
    function addPostGradFile(string fileName, string hash) public{
        require(msg.sender== deployer); // works only for student
        postgradFiles.fileName = fileName;
        postgradFiles.iPFSHash = hash;
    }
    function getsecFiles() public view returns(string){
            // require(msg.sender!= deployer); // called by requester to check status of his/her request
            return secFiles.iPFSHash;
    } 
    function gethsecFiles() public view returns(string){
            // require(msg.sender!= deployer); // called by requester to check status of his/her request
            return hsecFiles.iPFSHash;
    }
     function getgradFiles() public view returns(string){
            // require(msg.sender!= deployer); // called by requester to check status of his/her request
            return gradFiles.iPFSHash;
    } 
    function gethpostgradFiles() public view returns(string){
            require(msg.sender!= deployer); // called by requester to check status of his/her request
            return postgradFiles.iPFSHash;
    }
    
}