export class invalidAmount extends Error {
	constructor() {
		super("Valor deve ser um inteiro maior que zero (em centavos)!")
	}
}
