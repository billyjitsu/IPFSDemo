const main = async () => {
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
  console.log("Contract deployed to:", nftContract.address);

  [owner, addr1, addr2, _] = await ethers.getSigners();

  await nftContract.setOnlyWhitelisted(false);

  let txn = await nftContract.mint(1)
  await txn.wait()
  console.log("Minted NFT #1")

  await nftContract.connect(addr1).mint(1, 
    {value: ethers.utils.parseEther('.001')})
    console.log("Minted NFT #2")
  

  // Call the function.
 //let txn = await nftContract.mint(1)
  // Wait for it to be mined.
 // await txn.wait()
 // console.log("Minted NFT #1")
  //await nftContract.reveal();

 
  /*
  for(let i = 0; i < 149; i++ ) {
    txn = await nftContract.mint(1)
    // Wait for it to be mined.
    await txn.wait()
    console.log("Minted NFT #", i)
  }
  */

  /*
  let info = await nftContract.baseURI();
  console.log(info)
  let token = await nftContract.tokenURI(1);
  console.log(token)
  let rev = await nftContract.reveal();
  await rev.wait()
  token = await nftContract.tokenURI(1);
  console.log(token)
*/
/*
  txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #2")
  */
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();