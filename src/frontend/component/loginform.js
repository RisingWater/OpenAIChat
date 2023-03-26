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

export class LoginForm extends React.Component {
    onFinish = (values) => {
        var json = { "username": values.username, "password": values.password };
        var userid = null;
        $.ajax({
            type: "post",
            url: "/user/login",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(json),
            success: function (data, status) {
                if (data.result == 0) {
                    userid = data.userid;
                } else {
                    console.log("user/login ajax failed");
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

    guestLogin() {
        setCookie("userid", "guest");
        window.location.href = "./index.html";
    }

    render() {
        return (
            <Form
                name="basic"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}>
                <Form.Item name="username" rules={[{ required: true, message: '请输入邮箱地址!' }]} style={{ marginBottom: '16px' }}>
                    <Input size="large" prefix={<MailOutlined style={{ width: '24px' }} />} placeholder="请输入邮箱地址" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]} style={{ marginBottom: '16px' }}>
                    <Input.Password size="large" prefix={<LockOutlined style={{ width: '24px' }} />} placeholder="请输入密码" />
                </Form.Item>
                <Form.Item style={{ marginBottom: '16px' }}>
                    <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                    <div style={{ height: 8 }} />
                    <Button className="login-form-button" onClick={() => {
                        this.guestLogin();
                    }}>访客登录</Button>
                    <div style={{ height: 8 }} />
                    或者 <a href="./user_operation.html?op=register">注册新用户</a>
                </Form.Item>
            </Form>
        );
    }
}