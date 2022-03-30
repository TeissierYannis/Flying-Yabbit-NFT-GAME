import {ethers} from 'ethers';

class web3 {

    #contractAddress = "0x0";
    #ethersProvider = null;
    #provider = null;
    #signer = null;
    #contract = null;

    #totalSupply = 0;
    #balance = 0;
    #userAddress = "0x0";
    #contentID = null;

    constructor(ethersProvider, contractAddress, abi) {
        this.#contractAddress = contractAddress;
        this.#ethersProvider = ethersProvider;
        this.#provider = new ethers.providers.Web3Provider(ethersProvider);
        this.#signer = this.#provider.getSigner();
        this.#contract = new ethers.Contract(this.#contractAddress, abi, this.#signer);

        this.#contentID = 'Qmd5UYZXLQErPhEVj388JYsaXHAYtMDgM2sUdGHqXs5Xqz';
    }

    /**
     * Get total supply of the token
     * @returns {Promise<number>}
     */
    async getTotalSupply() {
        if (this.#totalSupply === 0) {
            let totalSupply = await this.#contract.totalSupply();
            totalSupply = ethers.utils.formatEther(totalSupply)
            totalSupply = totalSupply * 1000000000000000000;
            this.#totalSupply = totalSupply;
        }
        return this.#totalSupply;
    }

    /**
     * Get user address from the provider
     * @returns {Promise<string>}
     */
    async getUserAddress() {
        if (this.#userAddress === "0x0") {
            const [address] = await this.#ethersProvider.request({method: 'eth_requestAccounts'})
            this.#userAddress = address;
        }
        return this.#userAddress;
    }

    /**
     * Get balance of the account
     * @param account
     * @returns {Promise<number>}
     */
    async getBalance() {

        const account = await this.getUserAddress();

        if (this.#balance === 0) {
            let balance = await this.#contract.balanceOf(account);
            balance = ethers.utils.formatEther(balance)
            balance = balance * 1000000000000000000;
            this.#balance = balance;
        }
        return this.#balance;
    }

    getNFTURI(tokenID) {

        const imageURI = `https://gateway.pinata.cloud/ipfs/${this.#contentID}/${tokenID}.png`;

        // fetch img from IPFS with get request
        return {
            id: tokenID,
            uri: imageURI,
        }
    }
}

export default web3;