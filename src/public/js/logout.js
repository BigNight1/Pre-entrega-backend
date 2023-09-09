const logoutButton = document.getElementById("logoutButton")

logoutButton.addEventListener("click",()=>{
    fetch("api/session/logout",{
        method: "POST",
    })
    .then(response => response.json())
    .then((data)=>{
        if (data.status === "success") {
            window.location.replace("/login")
        }
    })
    .catch((error)=>{
        console.log("Errror al cerrar Session", error)
    })
})

