import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Row,
  Col,
  Card,
  Pagination,
  Input,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../productActions";
import ProductForm from "./ProductForm";
import BaseContainer from "../components/BaseContainer";

const { Title } = Typography;

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleChangePage = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    message.success("Product deleted");
  };

  const showEditModal = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      title: "No", // Nama kolom
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      ...getColumnSearchProps("category"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      ...getColumnSearchProps("price"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount - b.discount,
      ...getColumnSearchProps("discount"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ marginLeft: 10 }}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <BaseContainer>
      <Row gutter={16}>
        <Col span={24}>
          <Card className="header-card" style={{ marginBottom: 20 }}>
            <Title level={3}>Product Management</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{ float: "right", marginBottom: 10 }}
            >
              Add Product
            </Button>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Table
              columns={columns}
              dataSource={paginatedData}
              rowKey="id"
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: products.length,
                onChange: handleChangePage,
                pageSizeOptions: ["5", "10", "20", "50"],
                showSizeChanger: true,
                showQuickJumper: true,
                position: ["topRight"], // Pagination di pojok kanan atas
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <ProductForm product={editingProduct} onClose={handleModalClose} />
      </Modal>
    </BaseContainer>
  );
};

export default ProductList;
