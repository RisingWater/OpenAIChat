import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import $ from 'jquery';

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
}

export class ChangePasswordForm extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.formRef = React.createRef();
        this.state = {
            userid: ""
        };
    }

    componentWillMount() {
        var userid = getCookie("userid");
        this.setState({ userid: userid });
    }

    onFinish = (values) => {
        var json = { "userid": this.state.userid, "password": values.password, "password_new": values.password_new };
     
        var change = false;
        $.ajax({
            type: "post",
            url: "user/changepassword",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(json),
            success: function (data, status) {
                if (data.result == 0) {
                    change = true;
                } else {
                    console.log("changepassword ajax failed " + data.result);
                }
            }
        })

        if (change == false) {
            this.props.showError(true);
            return;
        }

        window.location.href = "./index.html";
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    validatorNew = (rule, value, callback) => {
        if (value && value !== this.formRef.current.getFieldValue('password_new')) {
            callback('两次输入的密码不匹配!');
        } else {
            callback();
        }
    };

    render() {
        return (
            <Form name="changepassword"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                ref={this.formRef}>
                <Form.Item name="password" rules={[{ required: true, message: '请输入原密码!' }]}>
                    <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入原密码" />
                </Form.Item>
                <Form.Item
                    name="password_new"
                    rules={[{ required: true, message: '请输入新密码!' }]}>
                    <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入新密码" />
                </Form.Item>
                <Form.Item
                    name="confirm_new"
                    rules={[
                        { required: true, message: '请再次输入新密码!' },
                        { validator: this.validatorNew }
                    ]}>
                    <Input.Password size="large" prefix={<LockOutlined />} placeholder="请再次输入新密码" />
                </Form.Item>
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" className="login-form-button">修改</Button>
                </Form.Item>
            </Form>
        );
    }
}