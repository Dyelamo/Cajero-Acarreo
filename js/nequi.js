let estado = "inicio"; 
let numero = "";
let monto = 0;
let clave = null;
let buffer = "";
let claveActiva = false; // bandera para controlar expiración

function iniciarNequi() {
  estado = "numero";
  numero = "";
  claveActiva = false;
  document.getElementById("pantalla").innerHTML = `
    <h2>Retiro Nequi</h2>
    <p>Ingrese número de celular (10 dígitos)</p>
    <div id="entrada"></div>
  `;
}

function flujoNequi(entrada) {
  const pantalla = document.getElementById("pantalla");

  if (estado === "numero") {
    numero += entrada;
    document.getElementById("entrada").textContent = numero;

    if (numero.length === 10) {
      estado = "monto";
      pantalla.innerHTML = `
        <h2>Número ingresado: ${numero}</h2>
        <p>Seleccione el monto:</p>
        <button onclick="seleccionarMonto(100000)">$100.000</button>
        <button onclick="seleccionarMonto(200000)">$200.000</button>
        <button onclick="seleccionarMonto(500000)">$500.000</button>
      `;
    }
  }

  else if (estado === "clave" && claveActiva) {
    buffer += entrada;
    document.getElementById("entrada").textContent = buffer;

    if (buffer.length === 6) {
      if (buffer === clave.toString()) {
        claveActiva = false; // desactiva expiración
        const billetes = metodoAcarreo(monto);
        pantalla.innerHTML = `
          <h2>✅ Retiro exitoso</h2>
          <p>Número: 0${numero}</p>
          <h3>Billetes entregados:</h3>
          <ul>
            ${Object.entries(billetes)
              .map(([den, cant]) => `<li>${cant} x $${den}</li>`)
              .join("")}
          </ul>
        `;
      } else {
        pantalla.innerHTML += `<p style="color:red;">Clave incorrecta</p>`;
      }
      estado = "fin";
    }
  }
}

function seleccionarMonto(m) {
  monto = m;
  clave = Math.floor(100000 + Math.random() * 900000);
  buffer = "";
  estado = "clave";
  claveActiva = true;

  document.getElementById("pantalla").innerHTML = `
    <h2>Monto: $${monto}</h2>
    <p>Clave generada (válida 60s): <b>${clave}</b></p>
    <p>Ingrese la clave en el teclado:</p>
    <div id="entrada"></div>
  `;

  // Expira solo si la clave sigue activa
  setTimeout(() => {
    if (estado === "clave" && claveActiva) {
      document.getElementById("pantalla").innerHTML += `<p style="color:orange;">⏰ Clave expirada</p>`;
      claveActiva = false;
      estado = "fin";
    }
  }, 60000);
}
