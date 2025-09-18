function retiroBancolombia(numero, clave, monto) {
  if (!/^\d{11}$/.test(numero)) {
    return { error: true, mensaje: "Número de cuenta inválido: debe tener 11 dígitos." };
  }

  if (!/^\d{4}$/.test(clave)) {
    return { error: true, mensaje: "Clave inválida: debe ser 4 dígitos." };
  }

  return metodoAcarreo(monto);
}
