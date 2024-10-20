// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => uint256) public carbonCredits;

    // Pass msg.sender explicitly to Ownable's constructor
    constructor() ERC721("CarbonCredit", "CCNFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    // Function to mint a new Carbon Credit NFT
    function mintCarbonCreditNFT(address recipient, uint256 credits, string memory tokenURI) public onlyOwner {
        uint256 newItemId = tokenCounter;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        carbonCredits[newItemId] = credits;  // Store how many carbon credits this NFT represents
        tokenCounter += 1;
    }

    // Function to get carbon credits associated with an NFT
    function getCarbonCredits(uint256 tokenId) public view returns (uint256) {
        return carbonCredits[tokenId];
    }
}
