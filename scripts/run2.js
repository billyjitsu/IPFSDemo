const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('testNFT');
    const nftContract = await nftContractFactory.deploy(
        "Gigadig",
        "GIGA", 
        "ipfs://QmRGMsp4xshQG6gzWQd3FzuwTgmQjVsuuWZ6L6uxjvGSd4/", 
        "fakeURI"
        );
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
  
    // Call the function.
   let txn = await nftContract.mint(1)
    // Wait for it to be mined.
    await txn.wait()
    console.log("Minted NFT #1")

    let rev = await nftContract.reveal();
    await rev.wait()
    token = await nftContract.tokenURI(1);
  
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