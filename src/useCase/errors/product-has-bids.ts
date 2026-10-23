export class productHasBids extends Error {
	constructor() {
		super("Produto ja possui lances!")
	}
}
