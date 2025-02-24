document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("newsletter-form");
    const result = document.getElementById("newsletter-result");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        result.innerHTML = "A fazer a inscrição..."; // Show loading text

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
                result.innerHTML = `<span style="color:green;">Obrigado! O seu email foi registado com sucesso.</span>`; // Success message
            } else {
                result.innerHTML = `<span style="color:red;">Não foi possível registar o seu email. Tente novamente.</span>`; // Error message
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "<span style='color:red;'>Ocorreu um erro! Tente novamente.</span>";
        })
        .then(() => {
            form.reset(); // Reset form fields
            setTimeout(() => {
                result.innerHTML = ""; // Hide message after 3 seconds
            }, 3000);
        });
    });
});
