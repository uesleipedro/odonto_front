export const moneyMask = (value) => {
  value = value?.replace('.', '').replace(',', '').replace('R$ ', '').replace(/\D/g, '')

  const options = { minimumFractionDigits: 2 }
  const result = new Intl.NumberFormat('pt-BR', options).format(
    parseFloat(value) / 100
  )

  return 'R$ ' + result
}

export const teste = (input) => {
  console.log("input: ", input)
  input = String(input).replace(/^0+/, '').replace(/\D/g, '');

  if (input.length > 2) {
    input = input.slice(0, -2) + ',' + input.slice(-2);
  } else if (input.length === 2) {
    input = '0,' + input;
  } else if (input.length === 1) {
    input = '0,0' + input;
  }

  return input;
}

export const porcentagemMask = (value) => {

  console.log("entrou porcentagemMask: ", value)

  value = String(value)?.replace('%', '')

  value = value?.replace(/\D/g, '')

  let intValue = parseInt(value, 10)
  if (isNaN(intValue)) {
    intValue = ''
  } else if (intValue > 100) {
    intValue = 100
  }

  return intValue !== '' ? intValue + '%' : ''
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

export const maskCPF_CNPJ = (value) => {
  value = value?.replace(/\D/g, '')

  if (value?.length <= 11) {
    value = value?.replace(/(\d{3})(\d)/, '$1.$2')
    value = value?.replace(/(\d{3})(\d)/, '$1.$2')
    value = value?.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    value = value?.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value?.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value?.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value?.replace(/(\d{4})(\d)/, '$1-$2')
  }

  return value
}

export const maskPhone = (value) => {
  value = value?.replace(/\D/g, '')
  if (value?.length > 10) {
    value = value?.replace(/^(\d{2})(\d)/, '($1) $2')
    value = value?.replace(/(\d{5})(\d)/, '$1-$2')
  } else {
    value = value?.replace(/^(\d{2})(\d)/, '($1) $2')
    value = value?.replace(/(\d{4})(\d)/, '$1-$2')
  }

  return value
}

