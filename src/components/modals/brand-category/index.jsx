import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { useEffect } from 'react';
import { brandCategory } from '@service';
const { Option } = Select;

const Index = ({ visible, onOk, handleClose, update, getData, parentBrand }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (update) {
            form.setFieldsValue({
                name: update?.name || "",
                brand_id: parseInt(update?.brand_id) || "",

            })
        } else {
            form.resetFields()
        }
    });

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        try {
            if (update?.id) {
                await brandCategory.update(update.id, values);
                console.log(update);
                handleClose()
                getData()
            } else {
                await brandCategory.create(values);
                getData()
                handleClose()
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="Add Brand Category"
            open={visible}
            onOk={onOk}
            onCancel={handleClose}
            footer={null}
        >
            <Form
                form={form}
                name="brand_category_form"
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label=" Brand category name"
                    name="name"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px' }}
                    rules={[
                        {
                            required: true,
                            message: 'Enter brand category name!',
                        },
                    ]}
                >
                    <Input style={{ height: "40px" }} />
                </Form.Item>

                <Form.Item
                    name="brand_id"
                    label="Parent brand"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px' }}
                    rules={[
                        {
                            required: true,
                            message: 'Enter brand  name!',
                        },
                    ]}>
                    <Select
                        showSearch
                        placeholder="Select a Brand"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {parentBrand?.map((item, index) => (
                            <Option value={parseInt(item.id)} key={index}>
                                {item.name}
                            </Option>

                        ))}

                    </Select>
                </Form.Item>

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
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Index;
