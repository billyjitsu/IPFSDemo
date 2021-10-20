const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("testNFT", function () {


  it("Should return the new greeting once it's changed", async function () {

    let owner, addr1, addr2;
    beforeEach(async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('testNFT');
    const nftContract = await nftContractFactory.deploy(
      "Mystery Mint",
      "MYS", 
      "ipfs://QmWXza1Wx4WAiuyuWKh4LjT3oGLveLxdAtaDnWbhyMDYzY/", 
      "ipfs://QmWFbcEmC9PFaWWjDvincjacEm32pak8vT272Zwy98pMkV/1.json",  //hidden NFT
      {
        value: hre.ethers.utils.parseEther('1'),
      }
      );
      await nftContract.deployed();
      [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  });
});
