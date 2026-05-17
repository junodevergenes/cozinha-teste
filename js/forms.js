/* ═══════════════════════════════════════════════════════════
   forms.js — Integração de formulários | Cozinha Globo
   Envio via formsubmit.io (https://formsubmit.io)

   CONFIGURAÇÃO NECESSÁRIA:
   1. Na primeira vez que um formulário for enviado, formsubmit.io
      enviará um e-mail de confirmação para mkt@moinhoglobo.com.br.
      Confirme o endereço clicando no link do e-mail.
   2. A partir daí, todos os envios chegam automaticamente.
═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  function initForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"]');

    function showMessage(type, text) {
      let msg = form.querySelector(".cg-form-message");
      if (!msg) {
        msg = document.createElement("p");
        msg.className = "cg-form-message";
        msg.style.cssText = "margin-top:16px;font-weight:700;font-size:0.95rem;";
        form.appendChild(msg);
      }
      msg.style.color = type === "success" ? "#006EB6" : "#cc0000";
      msg.textContent = text;
    }

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.style.opacity = loading ? "0.6" : "1";
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const lgpd = form.querySelector('[name="lgpd"]');
      if (lgpd && !lgpd.checked) {
        showMessage("error", "Por favor, aceite a Política de Privacidade para continuar.");
        return;
      }

      setLoading(true);

      try {
        const data = new FormData(form);
        const response = await fetch(form.getAttribute("action"), {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        const json = await response.json().catch(() => ({}));

        if (response.ok && json.ok !== false) {
          form.reset();
          showMessage(
            "success",
            formId === "form-receita"
              ? "Receita enviada com sucesso! Obrigado por compartilhar."
              : formId === "form-depoimento"
              ? "Depoimento enviado com sucesso! Obrigado pelo carinho."
              : "Mensagem enviada com sucesso! Retornaremos em breve."
          );
        } else {
          showMessage(
            "error",
            (json && json.message) || "Não foi possível enviar. Tente novamente."
          );
        }
      } catch {
        showMessage("error", "Erro de conexão. Verifique sua internet e tente novamente.");
      } finally {
        setLoading(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initForm("form-contato");
      initForm("form-receita");
      initForm("form-depoimento");
    });
  } else {
    initForm("form-contato");
    initForm("form-receita");
    initForm("form-depoimento");
  }
})();
