import { useEffect, useState } from "react";
import { Button, Input, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalTable } from '@components';
import { BrandCategoryModal } from '@modals';
import { brandCategory, brands } from '@service';
import { ConfirmDelete } from '@components';


const Index = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [update, setUpdate] = useState({});
    const [total, setTotal] = useState();
    const [parentBrand, setParentbrand] = useState([]);
    const { search } = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState({
        search: "",
        limit: 2,
        page: 3,
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        let page = Number(urlParams.get("page")) || 1;
        let limit = Number(urlParams.get("limit")) || 2;
        setParams((prev) => ({
            ...prev,
            limit: limit,
            page: page,
        }));
    }, [search]);

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
            const res = await brandCategory.get(params);
            if (res.status === 200) {
                setData(res?.data?.data?.brandCategories);
                setTotal(res?.data?.data?.count);
                setFilteredData(res?.data?.data?.brandCategories); 
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    useEffect(() => {
        const filtered = data.filter(item => 
            item.name.toLowerCase().includes(params.search.toLowerCase())
        );
        setFilteredData(filtered);
    }, [params.search, data]); 

    const editData = (item) => {
        setUpdate(item);
        showModal();
    };

    const deleteData = async (id) => {
        const res = await brandCategory.delete(id);
        if (res.status === 200) {
            getData();
        }
    };

    const getBrands = async () => {
        try {
            const res = await brands.get();
            const fetchedCategories = res?.data?.data?.brands;
            setParentbrand(fetchedCategories);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBrands();
    }, [params]);

    const handleSearchChange = (e) => {
        setParams((prev) => ({
            ...prev,
            search: e.target.value,
        }));
    };
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

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
        },
        {
            title: 'Brand category name',
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
                        title={"Delete this Brand?"}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <BrandCategoryModal
                visible={isModalOpen}
                onOk={handleOk}
                handleClose={handleClose}
                getData={getData}
                update={update}
                parentBrand={parentBrand}
            />
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Search Categories"
                    size="large"
                    style={{ maxWidth: 260, minWidth: 20 }}
                    value={params.search}
                    onChange={handleSearchChange}
                />
                <div className="flex gap-2 items-center">
                    <Button type="primary" size="large" style={{ maxWidth: 160, minWidth: 20, backgroundColor: "orangered" }} onClick={showModal}>
                        Create
                    </Button>
                </div>
            </div>
            <GlobalTable
                data={filteredData} 
                columns={columns}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: total,
                    showSizeChanger: true,
                    pageSizeOptions: ['2', '3', '4', '6']
                }}
                handleChange={handleTableChange}
            />
        </>
    );
};

export default Index;
