import { Button, Form, Input, Typography } from 'antd';
import LoginImg from '../../assets/login-img.jpg';
import { useNavigate } from 'react-router-dom';
import { auth } from '@service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Index = () => {
    const { Link } = Typography;
    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        try {
            const response = await auth.sign_in(values);
            console.log(response);

        
            if (response?.status === 200 || response?.status === 201) {
                const access_token = response?.data?.data?.tokens?.access_token;
                localStorage.setItem("access_token", access_token);
                toast.success("Login successful!");
                navigate("/admin-panel");
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            console.log(error);
            toast.error("Login failed! Please check your credentials.");
        }
    };

    return (
        <>
            <div className='grid grid-col-1 lg:grid-cols-2 items-center'>
                <div className='hidden lg:block w-full h-[100vh] bg-[#dad3d33f]'>
                    <img src={LoginImg} alt="login-img" className='w-full' />
                </div>
                <div className='flex justify-center items-center w-full p-6 pt-20'>
                    {
                        <Form
                            name="sign_in"
                            initialValues={{
                                remember: true,
                            }}
                            style={{
                                maxWidth: "600px",
                                width: "340px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                            onFinish={onFinish}
                        >
                            <div>
                                <Form.Item
                                    label="Phone number"
                                    name="phone_number"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    style={{ marginBottom: '8px' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input phone number!',
                                        },
                                    ]}
                                >
                                    <Input style={{ height: "40px" }} />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    style={{ marginBottom: '8px' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password style={{ height: "40px" }} />
                                </Form.Item>
                            </div>

                            <Form.Item>
                                <Button block type='submit' htmlType="submit" style={{ backgroundColor: "#e35112", color: "white", height: "40px", fontSize: "18px", marginTop: "10px" }}>
                                    Sign In
                                </Button>
                                <Typography variant="body2" align="center" style={{ marginTop: "10px", }} />
                                Dont you have an account?
                                <Link href="/" style={{ marginLeft: "10px", fontSize: "18px", fontFamily: "serif" }}>
                                    Sign Up
                                </Link>
                            </Form.Item>
                        </Form>
                    }
                </div>
            </div>
            {/* Toast container to display notifications */}
            <ToastContainer />
        </>
    );
};

export default Index;
