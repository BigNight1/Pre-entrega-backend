document.getElementById('changePasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const newPassword = document.getElementsByName('newPassword')[0].value;

    // Obtén el token de la URL
    const url = window.location.href;
    const lastSlashIndex = url.lastIndexOf('/');
    const token = url.substring(lastSlashIndex + 1);

    try {
        // Realiza la solicitud al backend
        const response = await fetch(`/api/session/changePassword/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword }),
        });

        const data = await response.json();

        if (response.status === 200) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Contraseña Cambiada",
                showConfirmButton: false,
                timer: 1100
              });
              setTimeout(() => {
                window.location.href = "/login"
              }, 1200);
        }

        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
});
