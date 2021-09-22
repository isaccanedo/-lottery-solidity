const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider()); // We use provider to connect to the network

const { interface, bytecode } = require("../compile.js");

let lottery;
let accounts;
let owner;

beforeEach(async () => {
  // Get list of accounts that reside on current test network
  accounts = await web3.eth.getAccounts();
  owner = accounts[0];

  // Deploy the contract instance from any of the accounts
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address); // To make sure some value is defined
  });

  it("allows one account to buy ticket", async () => {
    await lottery.methods.buyTicket().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether")
    });

    const players = await lottery.methods.getParticipants().call({
      from: accounts[0]
    });

    assert.strictEqual(accounts[1], players[0]);
    assert.strictEqual(1, players.length);
  });

  it("allows multiple accounts to buy ticket", async () => {
    await lottery.methods.buyTicket().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether")
    });

    await lottery.methods.buyTicket().send({
      from: accounts[2],
      value: web3.utils.toWei("0.05", "ether")
    });

    await lottery.methods.buyTicket().send({
      from: accounts[3],
      value: web3.utils.toWei("0.02", "ether")
    });

    const players = await lottery.methods.getParticipants().call({
      from: accounts[0]
    });

    assert.strictEqual(accounts[1], players[0]);
    assert.strictEqual(accounts[2], players[1]);
    assert.strictEqual(accounts[3], players[2]);

    assert.strictEqual(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.buyTicket().send({
        from: accounts[0],
        value: 0
      });

      assert(false); // If this line of code runs, it means previous statement have not thrown any error
    } catch (err) {
      assert(err); // Checks truthyness
    }
  });

  it("only manager can call drawLots", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
