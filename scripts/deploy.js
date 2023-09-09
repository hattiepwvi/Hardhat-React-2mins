/**
 * 3、部署
 *   1） main() 部署完成后0错误退出脚本 process.exit(0)；否则报错并有错退出
 *        - 序执行完毕后，会自动退出。但是在某些情况下，我们可能希望在特定条件下手动退出程序，例如在发生错误时或者在异步操作完成后。
 *   2） 部署过程：
 *        - 通过 getSigner()获取部署者 deployer
 *        - 部署者余额
 *        - 合约工厂部署合约
 *   3) 部署命令：
 *        - hardhat本地网络部署 npx hardhat run script/deploy.js
 *           - 合约部署在 memory 里， 运行结束后会自动删除，所以无法与合约交互
 *        - 部署到测试网 npx hardhat run scripts/deploy.js --network sepolia
 *           - 修改 hardhat.config.js: 测试网(填写Alchemy_url, 账户即私钥)
 */

/**
 * 4、前端
 * 1) 前端所需 json 对象 (data)： 缺乏部署的时候生成的artfacts文件里包含用于链接前端的合约ABI和地址
 *    - node.js 的 fs 操作文件系统：创建、保存文件等；
 *    - abi: JSON.parse(token.interface.format("json")); 将 token.interface 格式化为 JSON 格式的字符串，再转换为 javascript 的 JSON 对象
 *         - 字符串有 JSON，CSV， XML，HTML，SQL 等格式
 *    - 创建frontend/src/Token.json 文件夹及其文件，并将 data 对象转换为字符串传给文件
 *         - fs.writeFileSync("文件路径", JSON.stringify(data));
 *
 * 2) frontend 文件夹下安装 npx hardhat node: 启动 Hardhat 开发环境中的本地节点/区块链
 *    - npx hardhat node 启动 Hardhat 开发环境时，默认情况下，它不会加载 .env 文件中定义的环境变量。
 *    - hui创建 20 个账户，每个账户都有 10000 ETH； 下面这个localhost 是 http://127.0.0.1:8545/
 *    - 将 合约 部署到本地区块链上： npx hardhat run scripts/deploy.js --network localhost
 *    - frontend/src/Token.json 会保存 合约地址和 abi
 *
 * 3) 前端网页
 *    - ethereum.js 创建合约实例并交互: ethersjs 后端
 *       - window.addEventListener("load", async () => { ... }) 检查浏览器是否支持以太坊，并等待用户授权访问以太坊账户(小狐狸钱包登陆)
 *       - 用户授权了访问，它会使用ethers.providers.Web3Provider创建一个以太坊提供者对象，并通过提供者对象 getSigner() 获取一个签名器（signer）
 *           - ethers 库的 Web3Provider 基于Web3.js库，可以与现代的以太坊浏览器（如MetaMask）进行集成，可以通过window.ethereum对象来访问以太坊提供者
 *           - Web3Provider (前端向区块链发送请求) 和JsonRpcProvider(后端发请求) 的底层实现和集成方式略有不同。Web3Provider适用于与现代以太坊浏览器集成，而JsonRpcProvider适用于与任何运行以太坊节点的服务器进行通信。
 *    - app.js 链接合约，小狐狸钱包选择 locahhost 8545 与其交互：前端网页
 *
 */

const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  console.log(`Token address: ${token.address}`);

  const data = {
    address: token.address,
    abi: JSON.parse(token.interface.format("json")),
  };
  fs.writeFileSync("frontend/src/Token.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
