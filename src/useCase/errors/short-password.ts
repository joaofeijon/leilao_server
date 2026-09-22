export class shortPassword extends Error {
	constructor() {
		super("Senha deve ter no minimo 6 caracteres!")
	}
}
