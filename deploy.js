const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode } = require('./compile')

const provider = new HDWalletProvider(
    'park sorry sadness syrup pistol imitate expire grace length tent spend leaf',   // mnemonic
    'https://rinkeby.infura.io/v3/1210400c89b94e5e845dc3f00bf181eb' // The network to deploy to (we have ether in this account on Rinkeby)
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();   // mnemonic can be used to generate many accounts

    const result = await new web3.eth.Contract(JSON.parse(interface))
                    .deploy({ data: bytecode })
                    .send({ gas: '1000000', from: accounts[0] })

    console.log('Contract deployed to', result.options.address);
}

deploy()