// SPDX-License-Identifier: SEE LICENSE IN MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

/**
 *  1.2 debug
 *     1) console.log("占位符%s", 占位符的内容);
 */

contract Token {
    string public name = "My Hardhat Token";
    string public symbol = "MHT";
    uint public totalSupply = 1000000;
    address public owner;
    mapping(address => uint256) public balances;

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    // event Mint(address indexed to, uint256 value);

    // function mint(address _to, uint256 _value) public returns (bool) {
    //     totalSupply = totalSupply - _value;
    //     balances[_to] = balances[_to] + _value;

    //     emit Mint(msg.sender, _value);
    //     return true;
    // }

    function transfer(address _to, uint _amount) external {
        console.log("Sender balance is %s", balances[msg.sender]);
        console.log("Trying to transfer %s tokens to %s", _amount, _to);
        console.log("To balance is %s", balances[_to]);

        require(balances[msg.sender] >= _amount, "Not enough tokens");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
    }

    function balanceOf(address _account) external view returns (uint) {
        return balances[_account];
    }
}
