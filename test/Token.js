const { expect } = require("chai");

/**
 * 2、测试
 *    1） 导入和打包
 *        - 导入断言包 chai 里的 expect 方法;
 *        - hardhat 的 ethers 会自动导入测试文件
 *           - 合约可以使用自己的方法，也能使用 ethers 库提供的 contract 对象的方法: token.connect(钱包地址)
 *        - 回调函数和异步操作紧密相关，回调函数的执行顺序是由事件队列管理的: 异步操作完成时，会触发一个回调函数来处理操作的结果。回调函数会被放入事件队列中，等待执行。
 *           - 同步是代码按照顺序一个接一个地执行（前面完成后才执行后面）；异步代码不会等待前一个操作完成，而是继续执行后续代码（将耗时的操作如网络请求放在后台执行，并在操作完成后触发相应的回调--也就是await后或者then后的操作，可以让主线程继续执行其他任务）；
 *           - 以在普通函数中模拟异步操作的行为，使用 setTimeout 函数将耗时的操作放在后台执行。在操作完成后，它会调用传递的回调函数。async 和 promise 等本身具有异步操作的属性
 *               function performAsyncOperation(callback) {
 *                  setTimeout(function() {
 *                    callback();
 *                  }, 2000); 
}
 *    2) describe（名称， 回调函数） 测试套件组织和描述/打包所有、测试用例(部署、交易);
 *        - 部署：所有者及其钱； 交易：所有者、地址1都能调用交易，交易失败报错、回滚（余额不变），最终余额；
 *    3） beforeEach 每个测试用例之前执行 before each test;
 *        - ethers.getContractFactory(合约名).deploy() 用工厂合约来部署我们的合约
 *        - getSigners() 返回的是一个 Promise 对象，Promise 解析时会提供一个签名者对象的数组（数组中包含了签名者对象），数组中的元素分配给不同的变量
 *    4) it （名称， 回调函数） 测试用例
 *           - expect(value).to.equal(expected) 判断实际值 value 是否等于期望值 expected，
 *           - await 等待 token.owner() 函数返回的 Promise 对象被解析: const value = await token.owner()
 */

describe("Token contract", () => {
  let Token, token, owner, addr1, addr2;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    // 解构赋值：_表示不需要获取的属性
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      // 希望 tocken 的 owner 是 所有这的地址
      expect(await token.owner()).to.equal(owner.address);
    });

    it("should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      await token.transfer(addr1.address, 50);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // 将该账户连接到 token 合约实例，以便使用该账户来执行合约的交易
      await token.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async () => {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await token.transfer(addr1.address, 100);
      await token.transfer(addr2.address, 50);

      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
