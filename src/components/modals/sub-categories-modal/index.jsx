import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { useEffect } from 'react';
import { subCategory } from '@service';
const { Option } = Select;

const Index = ({ visible, onOk, handleClose, update, getData, categories }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (update) {
            form.setFieldsValue({
                name: update?.name || "",
                parent_category_id: parseInt(update?.parent_category_id)|| "",

            })
        } else {
            form.resetFields()
        }
    });

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        try {
            if (update?.id) {
                await subCategory.update(update.id, values);
                console.log(update);
                handleClose()

                getData()
            } else {
                await subCategory.create(values);
                getData()
                handleClose()
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="Add New Category"
            open={visible}
            onOk={onOk}
            onCancel={handleClose}
            footer={null}
        >
            <Form
                form={form}
                name="category_form"
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Category name"
                    name="name"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px' }}
                    rules={[
                        {
                            required: true,
                            message: 'Enter category name!',
                        },
                    ]}
                >
                    <Input style={{ height: "40px" }} />
                </Form.Item>

                <Form.Item
                    name="parent_category_id"
                    label="Parent Category"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px' }}
                    rules={[
                        {
                            required: true,
                            message: 'Enter category name!',
                        },
                    ]}>
                    <Select
                        showSearch
                        placeholder="Select a Category"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {categories?.map((item,index) => (
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
