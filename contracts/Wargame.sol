//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Wargame {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensPaid;
    uint256 public timeDeployed;


    mapping(address => uint256) public whiteListed;

    event PayPlayer(uint256 amount, address buyer);

    event WithdrawTokens(uint256 amount, address buyer);

    constructor(
        Token _token,
        uint256 _price,
        uint256 _maxTokens,
        uint256 _timeDeployed
    ) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
        timeDeployed = _timeDeployed;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
    // receive() external payable {
    //     uint256 amount = msg.value / price;
    //     payPlayer(amount * 1e18);
    // }

    function payPlayer( uint256 _amount) public {
        require(token.balanceOf(address(this)) >= _amount, "Balance not >= amount");
        require(token.transfer(msg.sender, _amount), "Invalid token transfer");

        tokensPaid += _amount;

        emit PayPlayer(_amount, msg.sender);

    }
    function withdrawTokens( uint256 _amount) external {
        require(token.balanceOf(msg.sender) >= _amount, "Balance not >= amount");
        require(token.transferFrom(msg.sender, address(this), _amount), "Invalid token transfer from");

        tokensPaid -= _amount;

        emit WithdrawTokens(_amount, msg.sender);

    }
    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

}