import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Space } from 'antd';
import { ChatBox, ChatWindow } from './component/chat_component.js';
import { HeaderBar } from './component/headerbar.js'
import $ from 'jquery';

const { Header, Content, Footer } = Layout;

function getCookie(name)
{
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
}

class RootContext extends React.Component {
    constructor(props) {
        super(props);
        this.HeaderRef = React.createRef();
        this.FooterRef = React.createRef();
        this.ChatWindoRef = React.createRef();
        this.ChatBoxRef = React.createRef();

        this.state = {
            ContextHeight: 0,
            CheckWindowHeight: 0,
            chatid : "",
            user : {
                result : -1,
                userid : "",
                username : "",
                isAdmin : false
            }
        }
    }
    
    reload_user() {
        var userid = getCookie("userid");
        var user = null;

        if (userid == null) {
            return null;
        }

        var json = JSON.stringify({
            userid : userid,
        })

        $.ajax({
            type: "post",
            url:  "/user/check",
            contentType: "application/json",
            data: json,
            async: false,
            success: (data, status) => {
                if (status == "success") {
                    if (data.result == 0) {
                        user = data;
                    } else {
                        console.log("user/check failed");
                    }
                }
            }
        });

        if (user != null) {
            this.setState({ user : user });
            if (user.username == "guest") {
                this.setState({ guest : true});
            } else {
                this.setState({ guest : false});
            }
        }

        return user;
    }

    componentWillMount() {
        var user = this.reload_user();

        if (user == null) {
            window.location.href = "./user_operation.html?op=login"
        }
    }

    componentDidMount() {
        var HeaderHeight = this.HeaderRef.current.offsetHeight;
        var FooterHeight = this.FooterRef.current.offsetHeight;
        var CheckBoxHeight = this.ChatBoxRef.current.offsetHeight;
        var WindowHeight = $(window).height();
        var ContextHeight = WindowHeight - HeaderHeight - FooterHeight * 2;
        var CheckWindowHeight = ContextHeight - CheckBoxHeight;

        this.setState({
            ContextHeight: ContextHeight,
            CheckWindowHeight: CheckWindowHeight
        })
    }

    onChatBoxChange() {
        this.ChatWindoRef.current.RefreshDataSource();
    }

    render() {
        return (
            <Layout style={{ display: 'flex', flexDirection: 'column' }}>
                <div ref={this.HeaderRef} >
                    <HeaderBar user={this.state.user}/>
                </div>
                <Content style={{ flex: '1 0 auto', padding: 24, margin: 0, width: "100%", height: this.state.ContextHeight }}>
                    <div style={{ width: "100%", height: "100%" }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex', width: "100%" }}>
                                <ChatWindow ref={this.ChatWindoRef} contentHeight={this.state.CheckWindowHeight} userid={this.state.user.userid}/>
                                <div ref={this.ChatBoxRef}>
                                    <ChatBox onChange={this.onChatBoxChange.bind(this)} userid={this.state.user.userid}/>
                                </div>
                            </Space>
                        </div>
                    </div>
                </Content>
                <Footer ref={this.FooterRef} style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center' }}>©2023 Created by Risingwater</Footer>
            </Layout>
        );
    }
}

ReactDOM.render(
    <RootContext />,
    document.getElementById("root")
);