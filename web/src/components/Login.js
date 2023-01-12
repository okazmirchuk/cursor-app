import {Button, Form, Input, Typography} from 'antd';
import styled from "styled-components";

const {Title} = Typography

const Login = () => {
    const onFinish = (values) => {
        window.location.href = `/?user=${values.username}`
    };

    return (
        <>
            <FormStyled
                name="normal_login"
                className="login-form"
                initialValues={{remember: true}}
                onFinish={onFinish}
            >
                <Title level={2}>Please enter your name</Title>
                <Form.Item
                    name="username"
                >
                    <Input placeholder="Name"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Join Space
                    </Button>
                </Form.Item>
            </FormStyled>
        </>
    );
};

const FormStyled = styled(Form)`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`

export default Login;
