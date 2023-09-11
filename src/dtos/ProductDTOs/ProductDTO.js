class ProductDTO {
  constructor(name, price, description, category) {
    if (!name || !price || !description || !category) {
      throw new Error("Falta llenar un campo obligatorio");
    }

    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
    this.createdAt = new Date();
  }
}

export default ProductDTO;
