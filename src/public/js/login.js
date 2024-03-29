const form = document.getElementById("loginForm");

form.addEventListener("submit",async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  const response = await fetch("api/session/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    
    if (response.status === 200) {
      const responseData = await response.json()
      console.log(responseData)
      const {name}= responseData.payload
      window.location.replace("/products");
      alert(`Bienvenido ${name}`)
    }
    if(response.status === 400){
      alert("Datos Invalidos")
    }
  })

