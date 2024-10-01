import React, { useEffect, useState } from "react";
import { Button, Input, Space } from 'antd';
import { DeleteOutlined, EditOutlined, EnterOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalTable } from '@components';
import { CategoriesModal } from '@modals';
import { category } from '@service';
import { ConfirmDelete } from '@confirmation';
import { useTranslation } from "react-i18next";



const Index = () => {
  // const { id } = useParams();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState({});
  const [total, setTotal] = useState();
  const navigate = useNavigate()
  const { search } = useLocation()
  const [categories, setCategories] = useState([]);
  const { t, i18n: { changeLanguage } } = useTranslation()
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1
  })


  // ============ Table ==============
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination
    setParams((prev) => ({
      ...prev,
      limit: pageSize,
      page: current,
    })
    )
    const searchParams = new URLSearchParams(search)
    searchParams.set("page", `${current}`)
    searchParams.set('limit', `${pageSize}`)
    navigate(`?${searchParams}`)
  }

  //  ============ Modal ===========
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate({})
  };

  // ============ get Data ============
  const getData = async () => {
    // setTitle("Delete this Brands ?")
    try {
      const res = await category.get(params);
      if (res.status === 200) {
        setData(res?.data?.data?.categories);
        setTotal(res?.data?.data?.count)
        // console.log(data, "data");

      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [params]);

  // =========== edit Data ===========
  const editData = (item) => {
    setUpdate(item);
    showModal()
    // console.log(item);

  };


  // ======== delete Data ========= 
  const deleteData = async (id) => {
    const res = await category.delete(id);
    if (res.status === 200) {
      getData();
    }
  };

  // ========== single page ===========
  const handleView = (id) => {
    navigate(`/admin-panel/categories/${id}`);
  }

  // ============ search Data -===========
  const handleChange = (event) => {
    console.log(event.target.value);
    setParams((prev) => ({
      ...prev,
      search: event.target.value
    }))
    // console.log(params);


  }
  useEffect(() => {
    const params = new URLSearchParams(search)
    let page = Number(params.get("page")) || 1
    let limit = Number(params.get("limit")) || 2
    setParams((prev) => ({
      ...prev,
      limit: limit,
      page: page,
    }))
    // changeLanguage("uz")
  }, [search])


  const columns = [
    {
      title: '№',
      dataIndex: 'id',
    },
    {
      title: t("tableTitle"),
      dataIndex: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
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
            title={"Delete this Brands ?"}
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
