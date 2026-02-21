export const mapRange = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

export const lerp = (start: number, end: number, amount: number) => {
	return (1 - amount) * start + amount * end;
};
