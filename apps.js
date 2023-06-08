import express from "express";
import nuevosProductos from "./TerceraPre";

const app = express();


app.get('/products', (req,res)=>{
    res.send(nuevosProductos)
})

app.listen(8080,()=>console.log("Server Up"))