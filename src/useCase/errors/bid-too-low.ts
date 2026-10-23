export class bidTooLow extends Error {
	constructor() {
		super("Lance menor que o minimo permitido!")
	}
}
