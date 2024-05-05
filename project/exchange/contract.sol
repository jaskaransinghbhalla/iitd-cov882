// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// import "https://github.com/thirdweb-dev/contracts/blob/main/contracts/base/ERC20Base.sol";
import "@thirdweb-dev/contracts/base/ERC20Base.sol";
// import "@thirdweb-dev/contracts/extension/Ownable.sol";
contract VendorThirdWeb{
    ERC20Base token;
    uint256 public tokensPerMatic = 1;
    // uint256 val = token.balanceOf(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4);
    // pass the thirdweb-address so that contract can communicate with the third web contract
    constructor(address tokenAddress) {
        token = ERC20Base(tokenAddress);
        
    }

    function buyTokens() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "You need to send some matic to proceed");
        uint256 amountToBuy = msg.value * tokensPerMatic;
        uint256 vendorBalance = token.balanceOf(address(this)); //your-address
        require(
            vendorBalance >= amountToBuy,
            "Vendor Contract doesn't have enough balance"
        );
        bool sent = token.transfer(msg.sender, amountToBuy);
        require(sent, "Failed to Send");
        return amountToBuy;
    }

    function sellTokens(uint256 tokenAmountToSell) public {
        require(tokenAmountToSell > 0, "Specify an amount greater than 0");
        uint256 userBalance = token.balanceOf(msg.sender);
        require(userBalance >= tokenAmountToSell, "You have insufficient funds");
        uint256 amountofMaticToTransfer = tokenAmountToSell / tokensPerMatic;
        uint256 ownerMATICBalance = address(this).balance;
        require(
            ownerMATICBalance >= amountofMaticToTransfer,
            "Vendor doesn't have enough MATIC"
        );
        bool sent = token.transferFrom(
            msg.sender,
            address(this),
            tokenAmountToSell
        );
        require(sent, "Failed to tranfer tokens");
        (sent, ) = msg.sender.call{value: amountofMaticToTransfer}("");
        require(sent, "Failed to transfer Matic");
    }

    // function withdraw() public onlyOwner {
    //     uint256 ownerBalance = address(this).balance;
    //     require(ownerBalance > 0, "No MATIC is present");
    //     (bool sent, ) = msg.sender.call{value: address(this).balance}("");
    //     require(sent, "Failed to withdraw");
    // }
}
