/* eslint-disable no-console */
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80
});

export const getHolyKnightAddress = holy => {
	return holy && holy.holyKnightAddress;
};
export const getHolyAddress = holy => {
	return holy && holy.holyAddress;
};
export const getWethContract = holy => {
	return holy && holy.contracts && holy.contracts.weth;
};

export const getHolyKnightContract = holy => {
	return holy && holy.contracts && holy.contracts.holyKnight;
};
export const getHolyContract = holy => {
	return holy && holy.contracts && holy.contracts.holy;
};
export const getHolyV2Contract = holy => {
	return holy && holy.contracts && holy.contracts.holyV2;
};
export const getHolyPassageContract = holy => {
	return holy && holy.contracts && holy.contracts.holyPassage;
};
export const getHolyVisorContract = holy => {
	return holy && holy.contracts && holy.contracts.holyVisor;
};

export const getFarms = holy => {
	return holy
		? holy.contracts.pools.map(
				({
					pid,
					name,
					symbol,
					icon,
					tokenAddress,
					tokenSymbol,
					tokenContract,
					lpAddress,
					lpContract
				}) => ({
					pid,
					id: symbol,
					name,
					lpToken: symbol,
					lpTokenAddress: lpAddress,
					lpContract,
					tokenAddress,
					tokenSymbol,
					tokenContract,
					earnToken: 'holy',
					earnTokenAddress: holy.contracts.holy.options.address,
					icon
				})
		  )
		: [];
};

export const getPoolWeight = async (holyKnightContract, pid) => {
	const { allocPoint } = await holyKnightContract.methods.poolInfo(pid).call();
	const totalAllocPoint = await holyKnightContract.methods
		.totalAllocPoint()
		.call();
	return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint));
};

export const getEarned = async (holyKnightContract, pid, account) => {
	const result = await holyKnightContract.methods
		.pendingHoly(pid, account)
		.call();
	return result;
};

export const getTotalLPWethValue = async (
	holyKnightContract,
	wethContract,
	lpContract,
	tokenContract,
	pid
) => {
	const tokenAmountWholeLP = await tokenContract.methods
		.balanceOf(lpContract.options.address)
		.call();
	const tokenDecimals = await tokenContract.methods.decimals().call();
	const balance = await lpContract.methods
		.balanceOf(holyKnightContract.options.address)
		.call();
	const totalSupply = await lpContract.methods.totalSupply().call();
	const lpContractWeth = await wethContract.methods
		.balanceOf(lpContract.options.address)
		.call();
	const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply));
	const lpWethWorth = new BigNumber(lpContractWeth);
	const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2));
	const tokenAmount = new BigNumber(tokenAmountWholeLP)
		.times(portionLp)
		.div(new BigNumber(10).pow(tokenDecimals));

	const wethAmount = new BigNumber(lpContractWeth)
		.times(portionLp)
		.div(new BigNumber(10).pow(18));
	return {
		tokenAmount,
		wethAmount,
		totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
		tokenPriceInWeth: wethAmount.div(tokenAmount),
		poolWeight: await getPoolWeight(holyKnightContract, pid)
	};
};

export const approve = async (lpContract, holyKnightContract, account) => {
	console.log('Contract approve: ', lpContract);
	console.log('HolyKnight contract: ', holyKnightContract);
	console.log('Account: ', account);

	return lpContract.methods
		.approve(
			holyKnightContract.options.address,
			ethers.constants.MaxUint256.toString()
		)
		.send({ from: account });
};

export const getHolySupply = async holy => {
	return new BigNumber(await holy.contracts.holy.methods.totalSupply().call());
};

export const stake = async (holyKnightContract, pid, amount, account) => {
	return holyKnightContract.methods
		.deposit(pid, new BigNumber(amount).toString())
		.send({ from: account })
		.on('transactionHash', tx => {
			console.log(tx);
			return tx.transactionHash;
		});
};

export const unstake = async (holyKnightContract, pid, amount, account) => {
	return holyKnightContract.methods
		.withdraw(pid, new BigNumber(amount).toString())
		.send({ from: account })
		.on('transactionHash', tx => {
			console.log(tx);
			return tx.transactionHash;
		});
};
export const harvest = async (holyKnightContract, pid, account) => {
	return holyKnightContract.methods
		.deposit(pid, '0')
		.send({ from: account })
		.on('transactionHash', tx => {
			console.log(tx);
			return tx.transactionHash;
		});
};

export const getStaked = async (holyKnightContract, pid, account) => {
	try {
		const { amount } = await holyKnightContract.methods
			.userInfo(pid, account)
			.call();
		return new BigNumber(amount);
	} catch (e) {
		return new BigNumber(0);
	}
};

export const redeem = async (holyKnightContract, account) => {
	const now = new Date().getTime() / 1000;
	if (now >= 1597172400) {
		return holyKnightContract.methods
			.exit()
			.send({ from: account })
			.on('transactionHash', tx => {
				console.log(tx);
				return tx.transactionHash;
			});
	}
	return false;
};

export const approveMigrate = async (
	holyContract,
	holyPassageContract,
	account
) => {
	console.log('Contract approve: ', holyContract);
	console.log('HolyPassage contract: ', holyPassageContract);
	console.log('Account: ', account);

	return holyContract.methods
		.approve(
			holyPassageContract.options.address,
			ethers.constants.MaxUint256.toString()
		)
		.send({ from: account });
};

export const migrate = async (holyPassageContract, account) => {
	return holyPassageContract.methods
		.migrate()
		.send({ from: account })
		.on('transactionHash', tx => {
			console.log(tx);
			return tx.transactionHash;
		});
};

export const getMigratedTokens = async (holyPassageContract, account) => {
	try {
		const amount = await holyPassageContract.methods
			.migratedTokens(account)
			.call();
		return new BigNumber(amount);
	} catch (e) {
		return new BigNumber(0);
	}
};
