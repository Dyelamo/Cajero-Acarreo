document.querySelectorAll(".num").forEach(btn => {
  btn.addEventListener("click", () => {
    flujoNequi(btn.textContent);
  });
});

document.getElementById("enter").addEventListener("click", () => {
  // Por ahora ENTER no hace nada especial, el flujo depende del teclado numérico
});

document.getElementById("cancel").addEventListener("click", () => {
  iniciarNequi();
});

document.getElementById("reiniciar").addEventListener("click", () => {
  location.reload();
});
