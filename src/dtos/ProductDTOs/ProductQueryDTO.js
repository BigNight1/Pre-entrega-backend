class ProductQueryDTO {
  constructor(limit, page, sort, category) {
    this.limit = parseInt(limit) || 10;
    this.page = parseInt(page) || 1;
    this.sort = sort || null;
    this.category = category || null;
  }
}

export default ProductQueryDTO;
