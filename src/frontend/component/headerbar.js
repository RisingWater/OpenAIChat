import React from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { LogoutOutlined, LockOutlined } from '@ant-design/icons'

function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
        }
    }
}

class HeaderBarRightComponent extends React.Component {
    getChangePassword() {
        if (this.props.user.userid == "guest") {
            return (
                <div style={{ float: "right" }} />
            )
        } else {
            return (
                <Tooltip placement="bottom" title="修改密码">
                    <Button style={{ float: "right", marginTop: 16, marginLeft: 20 }} ghost={true} icon={<LockOutlined />} onClick={() => {
                        window.location.href = "./user_operation.html?op=changepassword";
                    }} />
                </Tooltip>
            )
        }
    }

    render() {
        if (this.props.user.userid == "") {
            return (
                <div />
            )
        } else {
            return (
                <div style={{ height: 64 }}>
                    <Tooltip placement="bottom" title="注销用户">
                        <Button style={{ float: "right", marginTop: 16, marginLeft: 20 }} ghost={true} icon={<LogoutOutlined />} onClick={() => {
                            clearCookie();
                            window.location.href = "./user_operation.html?op=login";
                        }} />
                    </Tooltip>
                    {this.getChangePassword()}
                    <div style={{ float: "right", color: 'white' }}>{this.props.user.username}</div>
                </div>
            )
        }
    }
}

export class HeaderBar extends React.Component {
    render() {
        return (
            <Layout.Header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'white' }}  >OpenAIChat Test</div>
                    <HeaderBarRightComponent user={this.props.user} />
                </div>
            </Layout.Header>
        )
    }
}