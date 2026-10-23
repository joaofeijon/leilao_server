// valores em centavos: inteiro maior que zero
export const isValidAmount = (amount: number) => Number.isInteger(amount) && amount > 0
