export class unauthorized extends Error {
	constructor() {
		super("Nao autorizado!")
	}
}
