// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//Import External Token
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";


contract testNFT is ERC721Enumerable, Ownable {
  using Strings for uint256;
  //bring in token standards
  using Address for address;
  using SafeERC20 for IERC20;
  //Bring in token
  IERC20 private token;

  string public baseURI;
  string public baseExtension = ".json";
  string public notRevealedUri;
  uint256 public cost = 1 * 10 **16; //.001 token
  //uint256 public cost = .001 ether;
  uint256 public maxSupply = 150;
  uint256 public maxMintAmount = 20;
  uint256 public nftPerAddressLimit = 20;
  uint256 prizeAmount = 0.001 ether; // prize amount
  uint256 private seed; //seed used to randomize winner
  bool public paused = false;
  bool public revealed = false;
  bool public onlyWhitelisted = true;
  address[] public whitelistedAddresses;
 
  mapping(address => uint256) public addressMintedBalance;

  //Emit even to send out winning  
  event WinningMint(address sender, uint256 prize);

  constructor(string memory _name, string memory _symbol, string memory _initBaseURI, string memory _initNotRevealedUri, address _token) 
    ERC721(_name, _symbol) payable {
    setBaseURI(_initBaseURI);
    setNotRevealedURI(_initNotRevealedUri);
    token = IERC20(_token);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  // must approve new token First    //added payment variable
  function mint(uint256 _mintAmount, uint256 _payment) public payable {
    require(!paused, "the contract is paused");
    uint256 supply = totalSupply();
    require(_mintAmount > 0, "need to mint at least 1 NFT");
    require(_mintAmount <= maxMintAmount, "max mint amount per session exceeded");
    require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");

    if (msg.sender != owner()) {
        if(onlyWhitelisted == true) {
            require(isWhitelisted(msg.sender), "user is not whitelisted");
            uint256 ownerMintedCount = addressMintedBalance[msg.sender];
            require(ownerMintedCount + _mintAmount <= nftPerAddressLimit, "max NFT per address exceeded");
        }
       // require(msg.value >= cost * _mintAmount, "insufficient funds");
        require(_payment >= cost * _mintAmount, "insufficient funds");
        //transfer token in after approval
        token.safeTransferFrom(msg.sender, address(this), _payment);
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      addressMintedBalance[msg.sender]++;
      _safeMint(msg.sender, supply + i);

      /*----adding in random reward system -----*/
      uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
      seed = randomNumber;

        if (randomNumber < 50) {
            console.log("%s won!", msg.sender);
            
            //require(prizeAmount <= address(this).balance, "Trying to withdraw more money than they contract has.");
            require(prizeAmount <= token.balanceOf(address(this)), "Trying to withdraw more money than they contract has.");
            token.safeTransfer(msg.sender, prizeAmount);
            //(bool success, ) = (msg.sender).call{value: prizeAmount}("");
            //require(success, "Failed to withdraw money from contract.");

            //emit event of winning
            emit WinningMint(msg.sender, prizeAmount);
        }
      /* ----------------------------*/
      
    }
  }
  
  function isWhitelisted(address _user) public view returns (bool) {
    for (uint i = 0; i < whitelistedAddresses.length; i++) {
      if (whitelistedAddresses[i] == _user) {
          return true;
      }
    }
    return false;
  }

  function walletOfOwner(address _owner) public view returns (uint256[] memory) {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function reveal() public onlyOwner() {
      revealed = true;
  }
  
  function setNftPerAddressLimit(uint256 _limit) public onlyOwner() {
    nftPerAddressLimit = _limit;
  }
  
  function setCost(uint256 _newCost) public onlyOwner() {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
  
  function setOnlyWhitelisted(bool _state) public onlyOwner {
    onlyWhitelisted = _state;
  }
  
  //pass in an array of type function not memory but calldata
  function whitelistUsers(address[] calldata _users) public onlyOwner {
    delete whitelistedAddresses;
    whitelistedAddresses = _users;
  }
 
  // to be removed it payable function is primary
  function withdraw(uint256 amount) public payable onlyOwner {
    token.safeTransfer(msg.sender, amount);
    //(bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    //require(success);
  }
}