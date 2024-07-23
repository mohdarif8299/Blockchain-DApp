const DigitalAssetNFT = artifacts.require("DigitalObjectIdentifier");

module.exports = function(deployer) {
  deployer.deploy(DigitalAssetNFT);
};