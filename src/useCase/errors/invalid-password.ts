export class invalidPassword extends Error {
	constructor() {
		super("Password invalida!")
	}
}