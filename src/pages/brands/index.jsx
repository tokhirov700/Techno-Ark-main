import { useEffect, useState } from "react";
import { Button, Input, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalTable } from '@components';
import { BrandsModal } from '@modals';
import { brands, category } from '@service';
import { ConfirmDelete } from '@components';
const Index = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState({});
  const [total, setTotal] = useState();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [categories, setCategories] = useState([]);
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    let page = Number(params.get("page")) || 1;
    let limit = Number(params.get("limit")) || 2;
    setParams((prev) => ({
      ...prev,
      limit: limit,
      page: page,
    }));
  }, [search]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParams((prev) => ({
      ...prev,
      limit: pageSize,
      page: current,
    }));
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", `${current}`);
    searchParams.set('limit', `${pageSize}`);
    navigate(`?${searchParams}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate({});
  };

  const getData = async () => {
    try {
      const res = await brands.get(params);
      if (res.status === 200) {
        const dataSetter = res?.data?.data?.brands;
        setData(dataSetter);
        setTotal(res?.data?.data?.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [params]);

  const editData = (item) => {
    setUpdate(item);
    showModal();
  };

  const deleteData = async (id) => {
    const res = await brands.delete(id);
    if (res.status === 200) {
      getData();
    }
  };

  const getCategories = async () => {
    try {
      const res = await category.get(params);
      const fetchedCategories = res?.data?.data?.categories;
      setCategories(fetchedCategories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [params]);

  const handleSearchChange = (e) => {
    setParams((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(params.search.toLowerCase())
  );

  const columns = [
    {
      title: '№',
      dataIndex: 'id',
    },
    {
      title: 'Brand name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => editData(record)}><EditOutlined /></Button>
          <ConfirmDelete
            id={record.id}
            onConfirm={deleteData}
            onCancel={() => console.log('Cancelled')}
            title={"Delete this Brand?"}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <BrandsModal
        visible={isModalOpen}
        onOk={handleOk}
        handleClose={handleClose}
        getData={getData}
        update={update}
        categories={categories}
      />
      <div className="flex items-center justify-between py-4">
        <Input 
          placeholder="Search Brands" 
          size="large" 
          style={{ maxWidth: 260, minWidth: 20 }} 
          onChange={handleSearchChange} 
        />
        <div className="flex gap-2 items-center ">
          <Button 
            type="primary" 
            size="large" 
            style={{ maxWidth: 160, minWidth: 20, backgroundColor: "orangered" }} 
            onClick={showModal}
          >
            Create
          </Button>
        </div>
      </div>
      <GlobalTable
        data={filteredData} 
        columns={columns}
        handleChange={handleTableChange}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['2', '3', '4', '6']
        }}
      />
    </>
  );
};

export default Index;
