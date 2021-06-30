/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message`
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *
 */

const SHA256 = require("crypto-js/sha256");
const BlockClass = require("./block.js");
const bitcoinMessage = require("bitcoinjs-message");

class Blockchain {
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    async initializeChain() {
        if (this.height === -1) {
            let block = new BlockClass.Block({ data: "Genesis Block" });
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     */
    _addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            block.time = new Date().getTime().toString().slice(0, -3);
            block.height = self.height + 1;
            if (self.height > -1) {
                // Not a genesis block
                var previousBlockHash = self.chain[self.chain.length - 1].hash;
                block.previousBlockHash = previousBlockHash;
            }
            block.hash = SHA256(JSON.stringify(block)).toString();
            self.height += 1;
            self.chain.push(block);
            await self.validateChain()
                .then((errorLog) => {
                    if (errorLog.length > 0) {
                        console.log("The chain is not valid:");
                        errorLog.forEach((error) => {
                            console.log(error);
                        });
                        reject('The chain is broken');
                    } else {
                        resolve(block);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject('An error has occurred');
                });
        });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            let message =
                address +
                ":" +
                new Date().getTime().toString().slice(0, -3) +
                ":starRegistry";
            resolve(message);
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     */
    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let timeOfMessageGeneration = parseInt(message.split(":")[1]);
            let currentTime = parseInt(
                new Date().getTime().toString().slice(0, -3)
            );
            if (Math.abs(currentTime - timeOfMessageGeneration) >= 5 * 60) {
                reject("Time limit has exceeded");
            }
            if (!bitcoinMessage.verify(message, address, signature)) {
                reject("Invalid Message Signature");
            }
            let data = {
                address: address,
                signature: signature,
                message: message,
                star: star,
            };
            let block = new BlockClass.Block(data);
            await self._addBlock(block);
            resolve(block);
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     */
    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
            var block = self.chain.find((obj) => obj.hash === hash);
            if (block) {
                resolve(block);
            } else {
                reject("Such a block doesn't exist");
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object
     * with the height equal to the parameter `height`
     */
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter((p) => p.height === height)[0];
            if (block) {
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain
     * and are belongs to the owner with the wallet address passed as parameter.
     */
    getStarsByWalletAddress(address) {
        let self = this;
        let stars = [];
        return new Promise(async (resolve, reject) => {
            for (var i = 1; i < self.chain.length; i++) {
                let data;
                await self.chain[i]
                    .getBData()
                    .then((blockData) => {
                        data = blockData;
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log("The block data is not retrievable");
                    });
                if (data.address === address) {
                    let starData = {
                        owner: address,
                        star: data.star,
                    };
                    stars.push(starData);
                }
            }
            if (stars.length > 0) {
                resolve(stars);
            } else {
                reject("Address doesn't have any stars registered");
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     */
    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            for (var i = 0; i < self.chain.length; i++) {
                await self.chain[i].validate().then((result) => {
                    if (!result) {
                        errorLog.push(i);
                    }
                });
                if (i < self.chain.length - 1) {
                    let blockHash = self.chain[i].hash;
                    let previousHash = self.chain[i + 1].previousBlockHash;
                    if (blockHash !== previousHash) {
                        errorLog.push(i);
                    }
                }
            }
            resolve(errorLog);
        });
    }
}

module.exports.Blockchain = Blockchain;
