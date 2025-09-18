function retiroAhorroMano(numero, clave, monto) {
  if (!/^[01]3\d{9}$/.test(numero)) {
    return { error: true, mensaje: "Número inválido: debe iniciar con 0 o 1 y el segundo dígito ser 3." };
  }

  if (!/^\d{4}$/.test(clave)) {
    return { error: true, mensaje: "Clave inválida: debe ser 4 dígitos numéricos." };
  }

  return metodoAcarreo(monto);
}
