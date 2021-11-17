// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
 
interface PurseToken {

    function transfer(address to, uint tokens) external  returns (bool success);

    function mint(address to, uint tokens) external;

    function transferFrom(address from, address to, uint tokens) external  returns (bool success);

    function balanceOf(address tokenOwner) external view returns (uint balance);

}

contract RestakingFarm is Ownable{
    using SafeERC20 for IERC20;

    // ---Contract Variables---
    string public name = "RestakingFarm";

    // Userinfo
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of PURSEs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accPursePerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accPursePerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }
    
    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 pursePerBlock;
        uint256 bonusMultiplier;
        uint256 lastRewardBlock;  // Last block number that PURSEs distribution occurs.
        uint256 accPursePerShare; // Accumulated PURSEs per share, times 1e12. See below.
        uint256 startBlock;
    }

    // The PURSE TOKEN!
    PurseToken public purseToken;
    PoolInfo[] public poolInfo;
    uint256 public totalMintToken;    
    uint256 public capMintToken;
    mapping(address => uint256) public poolId;  // poolId count from 1, need to subtract by 1 before using with variable poolInfo

    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event AddNewPool(address indexed owner, IERC20 indexed lpToken, uint256 pursePerBlock, uint256 bonusMultiplier, uint256 startBlock);
    event UpdatePoolReward(address indexed owner, uint256 indexed pid, uint256 pursePerBlock, uint256 bonusMultiplier);
    event ClaimReward(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    modifier poolExist(uint256 _pid) {
        require( _pid < poolInfo.length, "Pool not existed");
        _;
    }

    constructor(
        PurseToken _purseToken,
        uint256 _capMintToken
    ) {
        purseToken = _purseToken;
        capMintToken = _capMintToken;
        }    

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }
    // Add a new lp to the pool. Can only be called by the owner.
    function add(IERC20 _lpToken, uint256 _pursePerBlock, uint256 _bonusMultiplier, uint256 _startBlock) public onlyOwner {
        require(poolId[address(_lpToken)] == 0, "Farmer::add: lp is already in pool");
        uint256 lastRewardBlock = block.number > _startBlock ? block.number : _startBlock;
        poolId[address(_lpToken)] = poolInfo.length + 1;
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            pursePerBlock : _pursePerBlock,
            bonusMultiplier: _bonusMultiplier,
            lastRewardBlock: lastRewardBlock,
            accPursePerShare: 0,
            startBlock: _startBlock
        }));
        emit AddNewPool(msg.sender, _lpToken, _pursePerBlock, _bonusMultiplier, _startBlock);
    }

    // Update the given pool's PURSE _pursePerBlock. Can only be called by the owner.
    function set(uint256 _pid, uint256 _pursePerBlock, uint256 _bonusMultiplier) public onlyOwner poolExist(_pid){
        PoolInfo storage pool = poolInfo[_pid];
        updatePool(_pid);
        pool.pursePerBlock = _pursePerBlock;
        pool.bonusMultiplier= _bonusMultiplier;
        emit UpdatePoolReward(msg.sender, _pid, _pursePerBlock, _bonusMultiplier );
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public pure returns (uint256) {
        return _to-_from;
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public poolExist(_pid){
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 purseReward = multiplier*pool.pursePerBlock*pool.bonusMultiplier;
        if (totalMintToken < capMintToken) {
            if (totalMintToken + purseReward >= capMintToken) {
                uint256 PurseCanMint = capMintToken-totalMintToken;
                totalMintToken += PurseCanMint;
                purseToken.mint(address(this), PurseCanMint);
            } else {
                totalMintToken += purseReward;
                purseToken.mint(address(this), purseReward);
            }
        }
        pool.accPursePerShare = pool.accPursePerShare+(purseReward*1e12/lpSupply);
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to Restaking Pool for Purse allocation.
    function deposit(uint256 _pid, uint256 _amount) public poolExist(_pid) {        
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pending = user.amount*pool.accPursePerShare/1e12-user.rewardDebt;
            uint256 farmBal = purseToken.balanceOf(address(this));

            if (pending > farmBal) {
                pending = farmBal;
            }
            if(pending > 0) {
                safePurseTransfer(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount+_amount;
        }
        user.rewardDebt = user.amount*pool.accPursePerShare/1e12;
        emit Deposit(msg.sender, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public poolExist(_pid){

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");

        updatePool(_pid);
        uint256 pending = user.amount*pool.accPursePerShare/1e12-user.rewardDebt;
        uint256 farmBal = purseToken.balanceOf(address(this));

        if (pending > farmBal) {
            pending = farmBal;
        }

        if(pending > 0) {
            safePurseTransfer(msg.sender, pending);
        }
        if(_amount > 0) {
            user.amount = user.amount-_amount;
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount*pool.accPursePerShare/1e12;
        emit Withdraw(msg.sender, _amount);
    }

    // Harvest reward tokens from pool.
    function claimReward(uint256 _pid) public poolExist(_pid){

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);
        uint256 pending = user.amount*pool.accPursePerShare/1e12-user.rewardDebt;
        uint256 farmBal = purseToken.balanceOf(address(this));

        if (pending > farmBal) {
            pending = farmBal;
        }

        if(pending > 0) {
            safePurseTransfer(msg.sender, pending);
        }
        user.rewardDebt = user.amount*pool.accPursePerShare/1e12;

        emit ClaimReward(msg.sender, pending);
    }

    function capMintTokenUpdate (uint256 _newCap) public onlyOwner {
        capMintToken = _newCap;
    }

    // Safe purse transfer function, just in case if rounding error causes pool to not have enough PURSEs.
    function safePurseTransfer(address _to, uint256 _amount) internal {
        uint256 purseBal = purseToken.balanceOf(address(this));
        if (_amount > purseBal) {
            purseToken.transfer(_to, purseBal);
        } else {
            purseToken.transfer(_to, _amount);
        }
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.lpToken.safeTransfer(address(msg.sender), amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    // Return any token function, just in case if any user transfer token into the smart contract. 
    function returnAnyToken(address token, uint256 amount, address _to) public onlyOwner{
        require(_to != address(0), "send to the zero address");
        IERC20(token).safeTransfer(_to, amount);
    }

     // View function to see pending PURSEs on frontend.
    function pendingReward(uint256 _pid, address _user) external view poolExist(_pid) returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accPursePerShare = pool.accPursePerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        uint256 multiplier;
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 purseReward = multiplier*pool.pursePerBlock*pool.bonusMultiplier;
            accPursePerShare = accPursePerShare+(purseReward*(1e12)/lpSupply);
        }
        return (user.amount*(accPursePerShare)/(1e12)-(user.rewardDebt));
    }
}