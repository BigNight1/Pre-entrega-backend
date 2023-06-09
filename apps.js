import express from 'express';
import  ProductManager  from './TerceraPre.js';


const nuevosProductos = new ProductManager

const app = express();
const port = 8080;

const productos = nuevosProductos.getProducts();

console.log(productos)

app.get('/products', (req, res) => {
    const limite = req.query.limite;
    if (limite) {
        console.log(limite)
        let respuesta = productos;
        if (limite && !isNaN(Number(limite))) {
            respuesta = productos.slice(0, limite);
           
        }
        res.send(respuesta);
    }
    
    res.send(productos);
})

app.get("/products/:id", (req, res) => {

    const pid = productos.find((e) => e.id === Number(req.params.id));
    res.send(pid);
    console.log(pid)
});


app.listen(port, () => {
    console.log('servidor levantado en el puerto ', port);
});