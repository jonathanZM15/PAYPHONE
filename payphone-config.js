// payphone-config.js

function configurarPayPhone(totalAmount) {
  try {
    // 1. Verificamos que el SDK de PayPhone ya se haya descargado
    if (typeof window.payphone === "undefined" || !window.payphone.Button) {
      console.warn("⏳ PayPhone aún no está disponible. Reintentando en 500ms...");
      setTimeout(() => configurarPayPhone(totalAmount), 500);
      return;
    }

    const container = document.getElementById("payphone-btn-container");
    if (!container) return;

    // 2. Limpiamos el contenedor
    container.innerHTML = "";

    // 3. Calculamos los centavos
    const amountInCents = Math.round(Number(totalAmount) * 100);

    // 4. Renderizamos el botón
    window.payphone.Button({
      token: "TU_TOKEN_DE_PAYPHONE_AQUI", 
      btnHorizontal: true,
      btnCard: true,
      
      // Corrección aquí: Solo pasamos "actions"
      createOrder: function (actions) {
        const clientTransactionId = `AUT-${Date.now()}`;
        return actions.prepare({
          amount: amountInCents,
          amountWithoutTax: amountInCents,
          currency: "USD",
          clientTransactionId: clientTransactionId,
        });
      },
      
      onComplete: function (model) {
        try {
          console.log("=== RESPUESTA DEL API DE PAYPHONE ===");
          console.log(model);

          // Si es Aprobado, completamos la compra
          if (model && model.transactionStatus === "Approved") {
            showToast("Pago Aprobado", "Tx: " + model.transactionId);
            cart = {};
            renderAll();
            closeDrawer();
          } 
          // Si es Canceled explícito, lo mostramos en consola en vez de alert
          else if (model && model.transactionStatus === "Canceled") {
            console.warn("El usuario canceló la transacción.");
          }
          // Si es una instancia fantasma o incompleta, la ignoramos silenciosamente
          else {
            console.log("Instancia abortada ignorada silenciosamente.");
          }
        } catch (error) {
          console.error("Error procesando la respuesta de PayPhone:", error);
        }
      },
    }).render("#payphone-btn-container");
    
  } catch (error) {
    console.error("Error configurando PayPhone:", error);
  }
}

window.configurarPayPhone = configurarPayPhone;