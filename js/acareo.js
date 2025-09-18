
const billetes = [10000, 20000, 50000, 100000];

function metodoAcarreo(monto) {
  let suma = 0;
  let usados = [];
  let cantidadBilletes = {};

  for (let i = 0; suma < monto; i++) {
    for (let index = i % billetes.length; index < billetes.length && suma < monto; index++) {
      if (suma + billetes[index] <= monto) {
        suma += billetes[index];
        usados.push(billetes[index]);
      }
    }
  }

  usados.forEach(b => {
    cantidadBilletes[b] = (cantidadBilletes[b] || 0) + 1;
  });

  if (suma !== monto) {
    return { error: true, mensaje: "Monto no válido (solo múltiplos de 10.000)." };
  }

  return { error: false, cantidadBilletes };
}
