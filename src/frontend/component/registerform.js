import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import $ from 'jquery';

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

export class RegisterForm extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.formRef = React.createRef();
    }

    onFinish = (values) => {
        var json = { "username": values.username, "password": values.password };
    
        var userid = null;
        $.ajax({
            type: "post",
            url: "/user/register",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(json),
            success: function (data, status) {
                if (data.result == 0) {
                    userid = data.userid;
                } else {
                    console.log("user/register ajax failed " + data.result);
                }
            }
        })

        if (userid == null) {
            this.props.showError(true);
            return;
        }
        setCookie("userid", userid);
        window.location.href = "./index.html";
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    validatorNew = (rule, value, callback) => {
        if (value && value !== this.formRef.current.getFieldValue('password')) {
            callback('两次输入的密码不匹配!');
        } else {
            callback();
        }
    };

    render() {
        return (
            <Form name="register"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                ref={this.formRef}>
                <Form.Item
                    label="注册邮箱"
                    name="username"
                    rules={[
                        { type: 'email', message: '请输入正确的邮箱地址' },
                        { required: true, message: '请输入邮箱地址' }
                    ]}>
                    <Input size="large" type="email" prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
                </Form.Item>
                <Form.Item
                    label="输入密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}>
                    <Input.Password size="large"
                        prefix={<LockOutlined />}
                        placeholder="请输入密码" />
                </Form.Item>
                <Form.Item
                    label="确认密码"
                    name="confirm"
                    rules={[
                        { required: true, message: '请输入密码!' },
                        { validator: this.validatorNew }
                    ]}
                >
                    <Input.Password size="large"
                        prefix={<LockOutlined />}
                        placeholder="请再次输入密码" />
                </Form.Item>
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" className="login-form-button">注册</Button>
                </Form.Item>
            </Form>
        );
    }
}