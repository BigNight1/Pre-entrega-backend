class ProductDTO {
  constructor(name, price, description, category, stock) {
    if (!name || !price || !description || !category ||!stock) {
      throw new Error("Falta llenar un campo obligatorio");
    }

    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
    this.stock = stock;
    this.createdAt = new Date();
  }
}

export default ProductDTO;
