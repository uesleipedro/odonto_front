export const moneyMask = (value) => {
  value = value?.replace('.', '').replace(',', '').replace('R$ ', '').replace(/\D/g, '')

  const options = { minimumFractionDigits: 2 }
  const result = new Intl.NumberFormat('pt-BR', options).format(
    parseFloat(value) / 100
  )

  return 'R$ ' + result
}

export const formatarMoedaBRL = (valor) => {
    return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const toDecimalNumeric = (num) => {
  return Number((num
    ?.toString()
    .replace(',', '.')
    .replace(/\D/g, '') / 100
  ).toFixed(2))
}
