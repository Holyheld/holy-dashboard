export const timestampToDate = timestamp => {
	const temp = new Date(timestamp * 1000);
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const year = temp.getUTCFullYear();
	const month = months[temp.getUTCMonth()];
	const date = temp.getUTCDate();

	return `${date} ${month}, ${year}`;
};
