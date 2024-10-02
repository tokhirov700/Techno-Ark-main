import  { useEffect, useState } from "react";
import { Button, Input, Space, } from 'antd';
import { EditOutlined,  } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom'
import { GlobalTable, } from '@components';
import { ProductsModal } from '@modals'
import { category, products } from '@service';
import { ConfirmDelete } from '@confirmation';

const Index = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState({});
    const [total, setTotal] = useState();
    const [categories, setCategories] = useState([]);
    const { search } = useLocation()
    const navigate = useNavigate()
    const [params, setParams] = useState({
        search: "",
        limit: 2,
        page: 1
    })

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


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

    const getData = async () => {
        try {
            const res = await products.get(params);
            if (res.status === 200) {
                setData(res?.data?.data?.products);
                setTotal(res?.data?.data?.count)
    

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
        showDrawer()
        console.log(update);

    };


    const deleteData = async (id) => {
        const res = await products.delete(id);
        if (res.status === 200) {
            getData();
        }
    };








    const getCategories = async () => {
        try {
            const res = await category.get();
            const fetchedData = res?.data?.data?.categories;
            setCategories(fetchedData);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategories();
    }, [params]);

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
        },
        {
            title: 'Product name',
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
                        title={"Delete this Product ?"}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <ProductsModal
                onClose={onClose}
                open={open}
                getData={getData}
                update={update}
                categories={categories}
            />
            <div className="flex items-center justify-between py-4">
                <Input placeholder="Search Categories" size="large" style={{ maxWidth: 260, minWidth: 20 }} />
                <div className="flex gap-2 items-center ">
                    <Button type="primary" size="large" style={{ maxWidth: 160, minWidth: 20, backgroundColor: "orangered" }} onClick={showDrawer} >
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
