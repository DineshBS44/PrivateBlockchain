# Star Registry
A Private Blockchain which is capable of allowing users to register stars and retrieve data about the blockchain.

## How is the blockchain built?
The Private Blockchain is implemented using NodeJS. REST API is designed using ExpressJS which is a Node Framework.

## Features
* Get Block data using its height
* Get Block data using its hash
* Request for validation when a user enter his/her address which in turn returns a message to be signed by the user's wallet
* Submit a star registry within 5 minutes of signing the message along with providing signature hash, wallet address, message and the stars that the user is willing to register
* Verification of signed message and the constraint that the submission is done within 5 minutes of message generation is checked
* The user receives the block data after he has registered successfully for the star.
* Get star registry of a particular user using wallet address

## Libraries/services used
* **bitcoinjs-lib** - For verifying wallet address ownership
* **bitcoinjs-message** - For verifying the signed message
* **express** - Node framework used to create The REST API
* **body-parser** - Used as a middleware module for Express and will help us to read the json data submitted in a POST request
* **crypto-js** - Module containing some of the most important cryptographic methods and will help us create the block hash.
* **hex2ascii** - For decoding the data saved in the body of the block
* **morgan** - HTTP request logger middleware for Node JS

## Developer
<table>
<tr align="center">
<td>
Dinesh B S
<p align="center">
<img src = "https://i.ibb.co/kxLPy5G/dinesh-pic.jpg" width="150" height="150" alt="Dinesh B S (Insert Your Image Link In Src">
</p>
<p align="center">
<a href = "https://github.com/DineshBS44"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36"/></a>
<a href = "https://www.linkedin.com/in/dinesh-b-s-197983192/">
<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36"/>
</a>
</p>
</td>
</tr>
  </table>

## License
Licensed under MIT License :  https://opensource.org/licenses/MIT

<br>
<br>
