/*
test/Token-test.js
node --version
v16.20.1
npm --version
8.19.4
"ethers": "5.5.4",
"hardhat": "2.15.0"
npx hardhat test test/Token-test.js
                  one ether 1000000000000000000 one gwei  1000000000 one wei    1
one unit parsed   one ether 1000000000000000000 one gwei  1000000000 one wei    1
one unit format   one ether 1.0 one gwei  1.0 one wei    1
one ether format   as n wei 1000000000000000000 as n gwei 1000000000.0 as n ether 1.0
one gwei format    as n wei 1000000000 as n gwei 1.0 as n ether 0.000000001
one wei format     as n wei 1 as n gwei 0.000000001 as n ether 0.000000000000000001
*/
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const oneEther = BigNumber.from('1' + '0'.repeat(18));
const oneGwei = BigNumber.from('1' + '0'.repeat(9));
const oneWei = BigNumber.from('1');
const oneUnit = BigNumber.from('1');
//wei == decimals 0
const getWeiFromUnit = (n) => { return ethers.utils.parseUnits(n.toString(), 'wei'); }; // n is a BigNumber object, returns a BigNumber object
//qwei == decimals 9
const getGweiFromUnit = (n) => { return ethers.utils.parseUnits(n.toString(), 'gwei'); };
//ether == decimals 18
const getEtherFromUnit = (n) => { return ethers.utils.parseUnits(n.toString(), 'ether'); };
const nEther = getEtherFromUnit(oneUnit);
const nGwei = getGweiFromUnit(oneUnit);
const nWei = getWeiFromUnit(oneUnit);
console.log('                 ', 'one ether', oneEther.toString(), 'one gwei ', oneGwei.toString(), 'one wei   ', oneWei.toString());
console.log('one unit parsed  ', 'one ether', nEther.toString(), 'one gwei ', nGwei.toString(), 'one wei   ', nWei.toString());
console.log();
console.log('one unit format  ', 'one ether', ethers.utils.formatUnits(nEther, 'ether'), 'one gwei ', ethers.utils.formatUnits(nGwei, 'gwei'), 'one wei   ', ethers.utils.formatUnits(nWei, 'wei'));
console.log();
console.log('one ether format ', ' as n wei', ethers.utils.formatUnits(oneEther, 'wei'), 'as n gwei', ethers.utils.formatUnits(oneEther, 'gwei'), 'as n ether', ethers.utils.formatUnits(oneEther, 'ether'));
console.log('one gwei format  ', ' as n wei', ethers.utils.formatUnits(oneGwei, 'wei'), 'as n gwei', ethers.utils.formatUnits(oneGwei, 'gwei'), 'as n ether', ethers.utils.formatUnits(oneGwei, 'ether'));
console.log('one wei format   ', ' as n wei', ethers.utils.formatUnits(oneWei, 'wei'), 'as n gwei', ethers.utils.formatUnits(oneWei, 'gwei'), 'as n ether', ethers.utils.formatUnits(oneWei, 'ether'));