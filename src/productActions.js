import axios from "axios";

export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_PRODUCTS_REQUEST" });
    try {
      const response = await axios.get("http://localhost:8000/api/products");
      dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.message });
    }
  };
};

export const addProduct = (product) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/products",
      product
    );
    dispatch({ type: "ADD_PRODUCT_SUCCESS", payload: response.data });
  } catch (error) {
    console.error(error);
  }
};

export const updateProduct = (id, updatedProduct) => async (dispatch) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/products/${id}`,
      updatedProduct
    );
    dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: response.data });
  } catch (error) {
    console.error(error);
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:8000/api/products/${id}`);
    dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: id });
  } catch (error) {
    console.error(error);
  }
};
