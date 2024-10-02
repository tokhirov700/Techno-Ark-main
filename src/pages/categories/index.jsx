import { useEffect, useState } from "react";
import { Button, Input, Space } from 'antd';
import { EditOutlined, EnterOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalTable } from '@components';
import { CategoriesModal } from '@modals';
import { category } from '@service';
import { ConfirmDelete } from '@confirmation';

const Index = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState({});
  const [total, setTotal] = useState();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1
  });


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
      const res = await category.get(params);
      if (res.status === 200) {
        setData(res?.data?.data?.categories);
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
    const res = await category.delete(id);
    if (res.status === 200) {
      getData();
    }
  };

  const handleView = (id) => {
    navigate(`/admin-panel/categories/${id}`);
  };

  const handleChange = (event) => {
    setParams((prev) => ({
      ...prev,
      search: event.target.value
    }));
  };

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

  const columns = [
    {
      title: '№',
      dataIndex: 'id',
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-GB').replace(/\//g, '.'), 
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
            title={"Delete this Category?"}
          />
          <Button onClick={() => handleView(record.id.toString())}><EnterOutlined /></Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CategoriesModal
        visible={isModalOpen}
        onOk={handleOk}
        handleClose={handleClose}
        getData={getData}
        update={update}
      />
      <div className="flex items-center justify-between py-4">
        <Input placeholder="Search Categories" size="large" style={{ maxWidth: 260, minWidth: 20 }} onChange={handleChange} />
        <div className="flex gap-2 items-center ">
          <Button type="primary" size="large" style={{ maxWidth: 160, minWidth: 20, backgroundColor: "orangered" }} onClick={showModal}>
            Create
          </Button>
        </div>
      </div>
      <GlobalTable
        data={data}
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
