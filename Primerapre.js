class ProductManager {
    products;
    static id = 1
    constructor(title, description, price, thumbnail, code, stock,) {
        this.products = [];
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

    addProduct(product) {
        let productoAagregar = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,

            id: ProductManager.id
        };
        let existe = this.products.find((p) => p.code === product.code);
        if (existe) {
            return console.log("El CODIGO  " + product.code + " Ya existe");
        }
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            return console.log("Falta llenar un campo")
        }

        else {
            this.products.push(productoAagregar);
            ProductManager.id++
        }
    }

    getProducts() {
        return this.products;

    }

    getProductsById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            console.log(product)
        } else {
            console.log("error")
        }
    }
}

const nuevosProductos = new ProductManager();

const product1 = {
    title: "Zapatillas",
    description: "Zapatillas rojas",
    price: 3200,
    thumbnail: "A",
    code: "110",
    stock: 10,
};

const product2 = {
    title: "Guantes",
    description: "Guantes azules",
    price: 4000,
    thumbnail: "AB",
    code: "115",
    stock: 8,
};

const product3 = {
    title: "Pantalones",
    description: "Pantalon de moda",
    price: 5000,
    thumbnail: "ABC",
    code: "120", //repite code para forzar error
    stock: 11,
};

const product4 = {
    title: "Short",
    description: "Short Red",
    price: 6000,
    thumbnail: "ABCD",
    code: "125",
    stock: 13,
};

const product5 = {
    title: "Polo",
    description: "Polo clasico",
    price: 7850,
    thumbnail: "ABCDE",
    code: "130",
    stock: 15,
};

nuevosProductos.addProduct(product1);
nuevosProductos.addProduct(product2);
nuevosProductos.addProduct(product3);
nuevosProductos.addProduct(product4);
nuevosProductos.addProduct(product5);

console.log(nuevosProductos.getProducts())
