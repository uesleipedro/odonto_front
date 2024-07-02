export const moneyMask = (value) => {
  value = value?.replace('.', '').replace(',', '').replace(/\D/g, '')

  const options = { minimumFractionDigits: 2 }
  const result = new Intl.NumberFormat('pt-BR', options).format(
    parseFloat(value) / 100
  )

  

  return 'R$ ' + result
}

export const toDecimalNumeric = (num) => {
  return Number((num
    ?.toString()
    .replace(',', '.')
    .replace(/\D/g, '') / 100
  ).toFixed(2))
}