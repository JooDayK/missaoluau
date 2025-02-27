document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("mensagem-form");
    const result = document.getElementById("mensagem-result");
    let isSubmitting = false; // Flag to prevent double submissions

    // Função para validar o formulário
    function validateForm() {
        const requiredFields = form.querySelectorAll("[required]");
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add("error"); // Adiciona classe de erro ao campo vazio
            } else {
                field.classList.remove("error"); // Remove classe de erro se o campo estiver preenchido
            }
        });

        // Validação específica para o campo de email
        const emailField = form.querySelector("input[type='email']");
        if (emailField && !emailField.checkValidity()) {
            isValid = false;
            emailField.classList.add("error");
            result.innerHTML = `<span style="color:red;">Por favor, insira um endereço de email válido.</span>`;
            return false;
        }

        // Validação específica para o campo de telefone (opcional)
        const phoneField = form.querySelector("input[name='Contacto']");
        if (phoneField && !/^\d{9,}$/.test(phoneField.value.trim())) { // Verifica se o telefone tem pelo menos 9 dígitos
            isValid = false;
            phoneField.classList.add("error");
            result.innerHTML = `<span style="color:red;">Por favor, insira um número de telefone válido.</span>`;
            return false;
        }

        return isValid;
    }

    // Limpa mensagens de erro e remove a classe de erro ao digitar
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach(field => {
        field.addEventListener("input", () => {
            if (field.value.trim()) {
                field.classList.remove("error");
            }
            result.innerHTML = ""; // Limpa a mensagem de erro
        });
    });

    // Envio do formulário
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        if (isSubmitting) return; // Se já estiver enviando, sai da função
        isSubmitting = true; // Define a flag como true

        // Valida o formulário antes de enviar
        if (!validateForm()) {
            isSubmitting = false; // Reseta a flag se a validação falhar
            result.innerHTML = `<span style="color:red;">Por favor, preencha todos os campos obrigatórios corretamente.</span>`;
            return; // Interrompe o envio se houver erros
        }

        // Se o formulário for válido, prossegue com o envio
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        result.innerHTML = "A enviar a mensagem..."; // Mostra mensagem de carregamento

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status === 200) {
                result.innerHTML = `<span style="color:green;">Obrigado! A sua mensagem foi enviada com sucesso.</span>`; // Mensagem de sucesso
            } else {
                result.innerHTML = `<span style="color:red;">Não foi possível enviar a sua mensagem. Tente novamente.</span>`; // Mensagem de erro
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "<span style='color:red;'>Ocorreu um erro! Tente novamente.</span>";
        })
        .then(() => {
            form.reset(); // Limpa os campos do formulário
            setTimeout(() => {
                result.innerHTML = ""; // Oculta a mensagem após 3 segundos
                isSubmitting = false; // Reseta a flag após o envio
            }, 3000);
        });
    });
});