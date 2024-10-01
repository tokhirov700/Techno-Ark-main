import https from "./config";
const ProductDetails = {
    create: (data) => https.post("/product-detail/create", data),
    get: (parent_category_id) => https.get(`/product-detail/search/${parent_category_id}`),
    update: (id, data) => https.patch(`/product-detail/update/${id}`, data),
    delete: (id) => https.delete(`/product-detail/delete/${id}`),
};

export default ProductDetails;
