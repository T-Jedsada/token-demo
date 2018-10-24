pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenManager is Ownable, Pausable {

    struct Transfer {
        address contract_;
        address to_;
        uint amount_;
        bool failed_;
    }

    address public owner;
    address public token;

    Transfer[] public transactions;

    mapping(address => uint[]) public transactionIndexesToSender;

    ERC20 public ERC20Interface;

    event TransferSuccessful(address indexed from_, address indexed to_, uint256 amount_);
    event TransferFailed(address indexed from_, address indexed to_, uint256 amount_);

    constructor(address _token) public {
        owner = msg.sender;
        token = _token;
    }

    function transferTokens(address to_, uint256 amount_) public whenNotPaused {
        require(amount_ > 0);
        address from_ = msg.sender;
        ERC20Interface = ERC20(token);

        // uint256 transactionId = transactions.push(
        //     Transfer({
        //         contract_:  token,
        //         to_: to_,
        //         amount_: amount_,
        //         failed_: true
        //     })
        // );

        // transactionIndexesToSender[from_].push(transactionId - 1);

        if (amount_ > ERC20Interface.allowance(from_, address(this))) {
            emit TransferFailed(from_, to_, amount_);
            revert();
        }

        ERC20Interface.transferFrom(from_, to_, amount_);

        // transactions[transactionId - 1].failed_ = false;

        emit TransferSuccessful(from_, to_, amount_);
    }

    function() public payable {

    }

    function withdraw(address beneficiary) public payable onlyOwner whenNotPaused {
        beneficiary.transfer(address(this).balance);
    }
}