// ===== LÓGICA DE ACARREO =====
class CajeroAutomatico {
  constructor() {
    this._money = 0;
    this.billete = [10000, 20000, 50000, 100000];
    this.guardarBillete = [];
    this.cantidadBillete = {};
    this.currentFlow = "";
    this.currentInput = "";
    this.currentStep = "";
    this.generatedCode = "";
    this.timer = null;
    this.timeLeft = 60;
    this.phoneNumber = "";
    this.accountNumber = "";
    this.pin = "";
    this.inventarioBilletes = {
      10000: 50,
      20000: 40,
      50000: 30,
      100000: 20,
    };
  }

  // Lógica de acarreo proporcionada por el usuario
  logiCajero() {
    this.guardarBillete = [];
    this.cantidadBillete = {};
    let suma = 0;

    for (let i = 0; suma < this._money; i++) {
      for (let index = i % 4; index < 4 && suma < this._money; index++) {
        if (suma + this.billete[index] <= this._money) {
          suma += this.billete[index];
          this.guardarBillete.push(this.billete[index]);
        }
      }
    }

    this.guardarBillete.forEach((billete) => {
      if (this.cantidadBillete[billete]) {
        this.cantidadBillete[billete]++;
      } else {
        this.cantidadBillete[billete] = 1;
      }
    });
  }

  puedeCubrirMonto(monto) {
    let inventarioTemp = { ...this.inventarioBilletes }; // copia del inventario

    for (let denom of [100000, 50000, 20000, 10000]) {
      while (monto >= denom && inventarioTemp[denom] > 0) {
        monto -= denom;
        inventarioTemp[denom]--;
      }
    }

    return monto === 0;
  }

  getRetirosRestantes() {
    let totalBilletes = 0;
    for (const denom in this.inventarioBilletes) {
      totalBilletes += this.inventarioBilletes[denom];
    }
    return totalBilletes;
  }

  validateAmount(amount) {
    return amount > 0 && amount % 10000 === 0;
  }

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  startTimer() {
    this.timeLeft = 60;

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.showError("La clave ha expirado. Generando nueva clave...");
        setTimeout(() => {
          this.generateNewCode();
        }, 2000);
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerElement = document.getElementById("screen-timer");
    if (timerElement) {
      timerElement.innerHTML = `⏱️ Tiempo restante: <strong>${this.timeLeft}</strong> segundos`;
    }
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  generateNewCode() {
    this.generatedCode = this.generateCode();
    this.showCodeScreen();
  }

  showScreen(content) {
    document.getElementById("screen-content").innerHTML = content;
  }

  showError(message) {
    const content = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
                <button class="menu-btn" onclick="cajero.showMainMenu()">Volver al Menú</button>
            </div>
        `;
    this.showScreen(content);
  }

  showSuccess(message, details = "") {
    const content = `
    <div class="success-message">
        <h3>Retiro Exitoso</h3>
        <p>${message}</p>
        ${details}
        <button class="menu-btn" onclick="cajero.showMainMenu()">Nueva Transacción</button>
    </div>
  `;
    this.showScreen(content);
  }

  showMainMenu() {
    this.currentFlow = "";
    this.currentInput = "";
    this.currentStep = "";
    this.stopTimer();

    const content = `
            <h2>Bienvenido</h2>
            <p>Seleccione el tipo de retiro:</p>
            <div class="menu-options">
                <button class="menu-btn" onclick="cajero.selectFlow('nequi')">Retiro por Celular (Nequi)</button>
                <button class="menu-btn" onclick="cajero.selectFlow('ahorro')">Ahorro a la Mano</button>
                <button class="menu-btn" onclick="cajero.selectFlow('cuenta')">Cuenta de Ahorros</button>
            </div>
        `;
    this.showScreen(content);
  }

  selectFlow(flow) {
    this.currentFlow = flow;
    this.currentInput = "";

    switch (flow) {
      case "nequi":
        this.showPhoneInput();
        break;
      case "ahorro":
        this.showAhorroInput();
        break;
      case "cuenta":
        this.showAccountInput();
        break;
    }
  }

  // ===== NEQUI =====
  validatePhoneNumber(phone) {
    return /^\d{10}$/.test(phone);
  }

  showPhoneInput() {
    this.currentStep = "phone";
    const content = `
            <h2>Retiro por Celular (Nequi)</h2>
            <p>Ingrese su número de celular (10 dígitos):</p>
            <div class="amount-display">
                ${this.currentInput || "Ingrese número"}
            </div>
            <p><small>Use el teclado numérico para ingresar el número</small></p>
        `;
    this.showScreen(content);
  }

  showCodeScreen() {
    this.currentStep = "code-verification";
    const content = `
            <h2>Código de Verificación</h2>
            <p>Su código de verificación es:</p>
            <div style="font-size: 24px; font-weight: bold; color: #1abc9c; text-align: center; margin: 20px 0;">
                ${this.generatedCode}
            </div>
            <div class="screen-timer" id="screen-timer">
                ⏱️ Tiempo restante: <strong>60</strong> segundos
            </div>
            <p>Ingrese el código mostrado:</p>
            <div class="amount-display">
                ${this.currentInput || "Ingrese código"}
            </div>
        `;
    this.showScreen(content);
    this.startTimer();
  }

  // ===== AHORRO A LA MANO =====
  validateAhorroNumber(number) {
    if (!/^\d{11}$/.test(number)) return false;
    const firstDigit = number.charAt(0);
    const secondDigit = number.charAt(1);
    return (firstDigit === "0" || firstDigit === "1") && secondDigit === "3";
  }

  showAhorroInput() {
    this.currentStep = "ahorro-number";
    const content = `
            <h2>Ahorro a la Mano</h2>
            <p>Ingrese su número de 11 dígitos:</p>
            <p><small>Primer dígito: 0 o 1, Segundo dígito: 3</small></p>
            <div class="amount-display">
                ${this.currentInput || "Ingrese número"}
            </div>
            <p><small>Use el teclado numérico para ingresar el número</small></p>
        `;
    this.showScreen(content);
  }

  // ===== CUENTA DE AHORROS =====
  validateAccountNumber(number) {
    return /^\d{11}$/.test(number);
  }

  validatePin(pin) {
    return /^\d{4}$/.test(pin);
  }

  showAccountInput() {
    this.currentStep = "account-number";
    const content = `
            <h2>Cuenta de Ahorros</h2>
            <p>Ingrese su número de cuenta (11 dígitos):</p>
            <div class="amount-display">
                ${this.currentInput || "Ingrese cuenta"}
            </div>
            <p><small>Use el teclado numérico para ingresar el número</small></p>
        `;
    this.showScreen(content);
  }

  showPinInput() {
    this.currentStep = "pin";
    const content = `
            <h2>Clave de Seguridad</h2>
            <p>Ingrese su clave de 4 dígitos:</p>
            <div class="amount-display">
                ${"*".repeat(this.currentInput.length) || "Ingrese clave"}
            </div>
            <p><small>Use el teclado numérico para ingresar su clave</small></p>
        `;
    this.showScreen(content);
  }

  showAmountSelection() {
    const content = `
            <h2>Seleccionar Monto</h2>
            <p>Seleccione el monto a retirar:</p>
            <p><small>Solo múltiplos de $10.000</small></p>
            <div class="amounts-grid" style="margin-top: 20px;">
                <button class="amount-btn" onclick="cajero.selectAmount(10000)">$10.000</button>
                <button class="amount-btn" onclick="cajero.selectAmount(20000)">$20.000</button>
                <button class="amount-btn" onclick="cajero.selectAmount(40000)">$40.000</button>
                <button class="amount-btn" onclick="cajero.selectAmount(60000)">$60.000</button>
                <button class="amount-btn" onclick="cajero.selectAmount(80000)">$80.000</button>
                <button class="amount-btn" onclick="cajero.selectAmount(100000)">$100.000</button>
                <button class="amount-btn" onclick="cajero.showCustomAmount()">Otro Valor</button>
            </div>
        `;
    this.showScreen(content);
  }

  showCustomAmount() {
    this.currentStep = "custom-amount";
    const content = `
            <h2>Monto Personalizado</h2>
            <p>Ingrese el monto a retirar:</p>
            <p><small>Solo múltiplos de $10.000</small></p>
            <div class="amount-display">
                ${this.formatAmount(this.currentInput) || "Ingrese monto"}
            </div>
            <p><small>Use el teclado numérico para ingresar el monto</small></p>
        `;
    this.showScreen(content);
  }

  formatAmount(input) {
    if (!input) return "";
    const numValue = Number.parseInt(input) || 0;
    return numValue > 0 ? `$${numValue.toLocaleString()}` : input;
  }

 processWithdrawal(amount) {
  // ✅ Validación de montos
  if (!this.validateAmount(amount)) {
    this.showError(
      "Monto inválido, solo múltiplos de $10.000 permitidos. Reinicie el proceso."
    )
    return
  }

  // ✅ Validación de disponibilidad de billetes
  if (!this.puedeCubrirMonto(amount)) {
    this.showError(
      "El cajero no puede entregar este monto con los billetes disponibles. Intente con otro valor."
    )
    return
  }

  this._money = amount
  this.logiCajero()

  // 🔹 Descontar billetes reales del inventario
  for (const billete of this.guardarBillete) {
    if (this.inventarioBilletes[billete] > 0) {
      this.inventarioBilletes[billete]--
    } else {
      this.showError("Error: el cajero no tiene suficientes billetes.")
      return
    }
  }

  // Crear reporte de billetes
  let billBreakdown =
    '<div class="bill-breakdown"><h4>Billetes a entregar:</h4>'
  let totalBills = 0

  for (const denomination in this.cantidadBillete) {
    const count = this.cantidadBillete[denomination]
    totalBills += count
    billBreakdown += `<div class="bill-item"><span>$${Number.parseInt(
      denomination
    ).toLocaleString()}</span><span>${count} billetes</span></div>`
  }
  billBreakdown += `<div class="bill-item" style="border-top: 1px solid #1abc9c; margin-top: 10px; padding-top: 10px;"><strong><span>Total billetes:</span><span>${totalBills}</span></strong></div></div>`

  // Información de la transacción
  let transactionInfo = ""
  if (this.currentFlow === "nequi") {
    const fullNumber = "0" + this.phoneNumber
    transactionInfo = `<p><strong>Número:</strong> ${fullNumber}</p>`
  } else if (this.currentFlow === "ahorro") {
    transactionInfo = `<p><strong>Número:</strong> ${this.accountNumber}</p>`
  } else if (this.currentFlow === "cuenta") {
    transactionInfo = `<p><strong>Cuenta:</strong> ${this.accountNumber}</p>`
  }

  transactionInfo += `<p><strong>Monto:</strong> $${amount.toLocaleString()}</p>`

  // ✅ Mostrar éxito con breakdown + retiros restantes
  this.showSuccess(
    "Puede tomar su dinero.",
    transactionInfo +
      billBreakdown +
      `<p><strong>Retiros restantes: ${this.getRetirosRestantes()}</strong></p>`
  )
}


 inputNumber(num) {
  // Ignore symbols for most input steps
  if ((num === "-" || num === "+") && this.currentStep !== "custom-amount") {
    return;
  }

  const maxLength = this.getMaxLength();

  // 🔹 Validación para NEQUI (phone)
  if (this.currentStep === "phone") {
    const length = this.currentInput.length;

    // Primer dígito: solo 3
    if (length === 0 && num !== "3") {
      return;
    }

    // Del segundo dígito en adelante: solo números
    if (length >= 1 && !/^\d$/.test(num)) {
      return;
    }
  }

  // 🔹 Validación para AHORRO A LA MANO
  if (this.currentStep === "ahorro-number") {
    const length = this.currentInput.length;

    // Primer dígito: solo 0 o 1
    if (length === 0 && num !== "0" && num !== "1") {
      return;
    }

    // Segundo dígito: solo 3
    if (length === 1 && num !== "3") {
      return;
    }

    // Del tercer dígito en adelante: solo números
    if (length >= 2 && !/^\d$/.test(num)) {
      return;
    }
  }

  if (this.currentInput.length < maxLength) {
    this.currentInput += num;
    this.updateInputDisplay();
  }
}


  getMaxLength() {
    switch (this.currentStep) {
      case "phone":
        return 10;
      case "ahorro-number":
      case "account-number":
        return 11;
      case "code-verification":
        return 6;
      case "pin":
        return 4;
      case "custom-amount":
        return 10;
      default:
        return 20;
    }
  }

  updateInputDisplay() {
    const displayElement = document.querySelector(".amount-display");
    if (displayElement) {
      if (this.currentStep === "pin") {
        displayElement.textContent =
          "*".repeat(this.currentInput.length) || "Ingrese clave";
      } else if (this.currentStep === "custom-amount") {
        displayElement.textContent =
          this.formatAmount(this.currentInput) || "Ingrese monto";
      } else {
        displayElement.textContent =
          this.currentInput || this.getPlaceholderText();
      }
    }
  }

  getPlaceholderText() {
    switch (this.currentStep) {
      case "phone":
        return "Ingrese número";
      case "ahorro-number":
      case "account-number":
        return "Ingrese número";
      case "code-verification":
        return "Ingrese código";
      case "pin":
        return "Ingrese clave";
      case "custom-amount":
        return "Ingrese monto";
      default:
        return "";
    }
  }

  clearInput() {
    this.currentInput = "";
    this.updateInputDisplay();
  }

  enterInput() {
    switch (this.currentStep) {
      case "phone":
        if (this.validatePhoneNumber(this.currentInput)) {
          this.phoneNumber = this.currentInput;
          this.generatedCode = this.generateCode();
          this.currentInput = "";
          this.showCodeScreen();
        } else {
          this.showError("Número de celular inválido. Debe tener 10 dígitos.");
        }
        break;

      case "ahorro-number":
        if (this.validateAhorroNumber(this.currentInput)) {
          this.accountNumber = this.currentInput;
          this.currentInput = "";
          this.showPinInput();
        } else {
          this.showError(
            "Número inválido. Debe tener 11 dígitos, comenzar con 0 o 1, y el segundo dígito debe ser 3."
          );
        }
        break;

      case "account-number":
        if (this.validateAccountNumber(this.currentInput)) {
          this.accountNumber = this.currentInput;
          this.currentInput = "";
          this.showPinInput();
        } else {
          this.showError("Número de cuenta inválido. Debe tener 11 dígitos.");
        }
        break;

      case "code-verification":
        if (this.currentInput === this.generatedCode) {
          this.stopTimer();
          this.currentInput = "";
          this.showAmountSelection();
        } else {
          this.showError("Código incorrecto. Intente nuevamente.");
          this.currentInput = "";
          this.updateInputDisplay();
        }
        break;

      case "pin":
        if (this.validatePin(this.currentInput)) {
          this.pin = this.currentInput;
          this.currentInput = "";
          this.showAmountSelection();
        } else {
          this.showError("Clave inválida. Debe tener 4 dígitos.");
          this.currentInput = "";
          this.updateInputDisplay();
        }
        break;

      case "custom-amount":
        const amount = Number.parseInt(this.currentInput);
        if (amount && this.validateAmount(amount)) {
          this.processWithdrawal(amount);
        } else {
          this.showError(
            "Monto inválido, solo múltiplos de $10.000 permitidos. Reinicie el proceso."
          );
        }
        break;
    }
  }

  selectAmount(amount) {
    const content = `
            <h2>Confirmar Retiro</h2>
            <div class="amount-display">
                Monto seleccionado: <strong>$${amount.toLocaleString()}</strong>
            </div>
            <p>¿Confirma el retiro de este monto?</p>
            <div class="menu-options">
                <button class="menu-btn" onclick="cajero.processWithdrawal(${amount})">Confirmar Retiro</button>
                <button class="menu-btn" onclick="cajero.showAmountSelection()">Cambiar Monto</button>
            </div>
        `;
    this.showScreen(content);
  }

  cancelTransaction() {
    this.stopTimer();
    this.currentFlow = "";
    this.currentInput = "";
    this.currentStep = "";
    this.phoneNumber = "";
    this.accountNumber = "";
    this.pin = "";
    this.generatedCode = "";
    this.showMainMenu();
  }
}

// Inicializar el cajero
const cajero = new CajeroAutomatico();

// Funciones globales para los botones
function selectFlow(flow) {
  cajero.selectFlow(flow);
}

function inputNumber(num) {
  cajero.inputNumber(num);
}

function clearInput() {
  cajero.clearInput();
}

function enterInput() {
  cajero.enterInput();
}

function selectAmount(amount) {
  cajero.selectAmount(amount);
}

function showCustomAmount() {
  cajero.showCustomAmount();
}

function cancelTransaction() {
  cajero.cancelTransaction();
}
