import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, InputNumber, Button, message } from "antd";
import { addProduct, updateProduct } from "../productActions";

const ProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const onFinish = (values) => {
    if (isNaN(values.price) || isNaN(values.discount)) {
      message.error("Price and Discount must be valid numbers!");
      return;
    }
    if (product) {
      dispatch(updateProduct(product.id, values));
    } else {
      dispatch(addProduct(values));
    }
    form.resetFields();
    onClose();
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="product_name"
        label="Product Name"
        rules={[{ required: true, message: "Please input product name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please input category!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please input price!" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="discount"
        label="Discount"
        rules={[{ type: "number", message: "Discount must be a number!" }]}
      >
        <InputNumber
          min={0}
          max={100}
          style={{ width: "100%" }}
          // Tambahkan handler ini jika tetap diperlukan untuk validasi manual
          onChange={(value) => {
            if (isNaN(value)) {
              form.setFieldsValue({ discount: 0 });
            }
          }}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        {product ? "Update" : "Add"} Product
      </Button>
    </Form>
  );
};

export default ProductForm;
