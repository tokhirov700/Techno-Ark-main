import React from 'react';
import { Modal, Form, Input, Button, Select, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { products, brands, brandCategory } from '@service';
const { Option } = Select;

const Index = ({ open, onClose, update, getData, categories }) => {
    const [form] = Form.useForm();
    const [filteredBrands, setFilteredBrands] = useState([])
    const [filteredBrandCat, setFilteredBrandCat] = useState([])
    const [file, setFile] = useState([]);


    useEffect(() => {
        if (update?.id) {
            form.setFieldsValue({
                name: update?.name,
                price: update?.price,
                category_id: update?.category_id,
                brand_id: update?.brand_id,
                brand_category_id: update?.brand_category_id,
                files: update?.files
            })
        }
        else {
            form.resetFields();
        }
    }, [update, form])


    // ===========file ==========
    const handleChange = async (value, inputName) => {
        // let fileData = event.target.files[0]
        // setFile(fileData);
        try {
            if (inputName === "category_id") {
                const res = await brands.getBrands(value)
                setFilteredBrands(res?.data?.data?.brands)
                console.log(filteredBrands);

            } else if (inputName === "brand_id") {
                const res = await brandCategory.getBrandCat(value)
                setFilteredBrandCat(res?.data?.data?.brandCategories)
                console.log(filteredBrandCat);

            }
        } catch (error) {
            console.log(error);

        }


    };

    const handleFileChange = (event) => {
        const fileData = event.target.files[0];
        setFile(fileData);
    };

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        let formData = new FormData();
        formData.append("name", values?.name);
        formData.append("price", values?.price);
        formData.append("category_id", parseInt(values?.category_id));
        formData.append("brand_id", values?.brand_id);
        formData.append("brand_category_id", values?.brand_category_id);
        formData.append("files", file);
        try {
            if (update?.id) {
                await products.update(update.id, formData);
                console.log(update);
                onClose()
                getData()
            } else {
                const res = await products.create(formData);
                console.log(formData);
                if (res.status === 201) {
                    getData()
                    onClose()
                }

            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Drawer onClose={onClose} open={open} width={600}>
                <h2 className='text-[24px] font-semibold my-3'>Add Product</h2>

                <Form
                    form={form}
                    name="brands_form"
                    style={{ display: "flex", flexDirection: "column", }}
                    onFinish={onFinish}

                >
                    <div className='flex gap-3 '>
                        <Form.Item
                            label="Product name"
                            name="name"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginBottom: '8px' }}
                            rules={[
                                { required: true, message: 'Enter product name!' },
                            ]}
                        >
                            <Input style={{ height: "40px" }} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            label="Product price"
                            name="price"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginBottom: '8px' }}
                            rules={[
                                { required: true, message: 'Enter product price!' },
                            ]}
                        >
                            <Input style={{ height: "40px" }} type='number' onChange={handleChange} />
                        </Form.Item>
                    </div>
                    <div className='flex gap-3 mb-5'>
                        <Form.Item
                            name="category_id"
                            label=" Select Category"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginBottom: '8px', height: "40px", width: "100%" }}
                            rules={[
                                { required: true, message: 'Select category!' },
                            ]}

                        >
                            <Select
                                showSearch
                                style={{ height: "40px" }}
                                onChange={(value) => handleChange(value, "category_id")}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {categories?.map((item, index) => (
                                    <Option value={item.id} key={index}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="brand_id"
                            label="Select Brand"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ height: "40px", width: "100%" }}
                            rules={[
                                { required: true, message: 'Select Brand!' },
                            ]}
                        >
                            <Select
                                style={{ height: "40px" }}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => handleChange(value, "brand_id")}
                            >
                                {filteredBrands?.map((item, index) => (
                                    <Option value={item.id} key={index}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </div>
                    <div className='flex gap-3 mb-5 mt-4' >
                        <Form.Item
                            name="brand_category_id"
                            label="Select Brand  Category"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ height: "40px", width: "100%" }}
                            rules={[
                                { required: true, message: 'Select Brand category!' },
                            ]}
                        >
                            <Select
                                style={{ height: "40px" }}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => handleChange(value, "brand_category_id")}
                            >
                                {filteredBrandCat?.map((item, index) => (
                                    <Option value={item.id} key={index}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="file"
                            label="File"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: 'Upload file!' },
                            ]}>
                            <input type="file" height={80} onChange={handleFileChange} />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button
                            block
                            type="submit"
                            htmlType="submit"
                            style={{
                                backgroundColor: "#e35112",
                                color: "white",
                                height: "40px",
                                fontSize: "18px",
                                marginTop: "10px",
                            }}
                        >
                            Add
                        </Button>
                    </Form.Item>
                </Form>

            </Drawer>
        </>
    );
};

export default Index;
