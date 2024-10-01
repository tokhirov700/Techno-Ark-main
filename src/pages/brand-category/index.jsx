import React, { useEffect, useState } from "react";
import { Button, Input, Space, } from 'antd';
import { DeleteOutlined, EditOutlined, EnterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, NavLink, useParams, useLocation } from 'react-router-dom'
import { GlobalTable, } from '@components';
import { BrandCategoryModal } from '@modals'
import { brandCategory, brands } from '@service';
import { ConfirmDelete } from '@confirmation';

const Index = () => {
    // const { id } = useParams();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [update, setUpdate] = useState({});
    const [total, setTotal] = useState();
    const [parentBrand, setParentbrand] = useState([]);
    const { search } = useLocation()
    const navigate = useNavigate()
    const [params, setParams] = useState({
        search: "",
        limit: 2,
        page: 1
    })

    //========= get from query =========

    useEffect(() => {
        const params = new URLSearchParams(search)
        let page = Number(params.get("page")) || 1
        let limit = Number(params.get("limit")) || 2
        setParams((prev) => ({
            ...prev,
            limit: limit,
            page: page,
        }))
    }, [search])


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
        try {
            const res = await brandCategory.get();
            if (res.status === 200) {
                setData(res?.data?.data?.brandCategories);
                setTotal(res?.data?.data?.count)
                // console.log(data);

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
        const res = await brandCategory.delete(id);
        if (res.status === 200) {
            getData();
        }
    };

    //========= get categories ============
    const getBrands = async () => {
        try {
            const res = await brands.get();
            const fetchedCategories = res?.data?.data?.brands;
            setParentbrand(fetchedCategories);
            // console.log(parentBrand);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBrands();
    }, [params]);

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
                <Input placeholder="Search Categories" size="large" style={{ maxWidth: 260, minWidth: 20 }} />
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
                    pageSizeOptions: ['2', '3', '4', '6',]
                }}
            />
        </>
    );
};

export default Index;
