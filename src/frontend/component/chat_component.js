import React from 'react';
import { List, Avatar, Input, Button, Space } from 'antd';
import $ from 'jquery';

export class ChatWindow extends React.Component {
    constructor(props) {
        super(props);
        this.chatWindowRef = React.createRef();

        this.state = {
            humanAvatar: "./image/human.png",
            AIAvatar: "./image/ai.png",
            dataSource: [],
        }
    }

    RefreshDataSource() {
        var chatid = "";
        var json = JSON.stringify({
            userid : this.props.userid,
        })

        $.ajax({
            type: "post",
            url: "/user/getchatid",
            contentType: "application/json",
            data: json,
            async: false,
            success: (data, status) => {
                if (status == "success") {
                    if (status == "success") {
                        if (data.result == 0) {
                            chatid = data.chatid;
                        } else {
                            console.log("/user/getchatid ajax failed");
                        }
                    }
                }
            }
        });

        json = JSON.stringify({
            chatid : chatid,
        })

        $.ajax({
            type: "post",
            url: "/chat/show_all",
            contentType: "application/json",
            data: json,
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ dataSource: data });
                } else {
                    console.log("/chat/show_all ajax failed");
                }
            }
        });
    }

    componentDidMount() {
        this.RefreshDataSource();
    }

    componentDidUpdate() {
        const chatWindow = this.chatWindowRef.current;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    render() {
        return (
            <div ref={this.chatWindowRef} style={{ maxHeight: this.props.contentHeight, minHeight: this.props.contentHeight, width: "100%", overflowY: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.dataSource}
                    renderItem={item => (
                        <List.Item>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Space>
                                    <Avatar src={item.role == 0 ? this.state.humanAvatar : this.state.AIAvatar} />
                                    <div style={{ fontSize: 20 }}>{item.name}</div>
                                </Space>
                                <div style={{ fontSize: 16, wordWrap: "break-word", whiteSpace: "pre-wrap" }}>{item.content}</div>
                                <div style={{ fontSize: 10 }}>{item.time}</div>
                            </Space>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            isChatDisabled: false
        };
    }

    onChatBoxClick() {
        this.setState({ isChatDisabled: true }, () => {
            var chatid = "";
            var json = JSON.stringify({
                userid : this.props.userid,
            })
    
            $.ajax({
                type: "post",
                url: "/user/getchatid",
                contentType: "application/json",
                data: json,
                async: false,
                success: (data, status) => {
                    if (status == "success") {
                        if (status == "success") {
                            if (data.result == 0) {
                                chatid = data.chatid;
                            } else {
                                console.log("/user/getchatid ajax failed");
                            }
                        }
                    }
                }
            });

            json = JSON.stringify({ chatid : chatid, input: this.state.inputValue })

            $.ajax({
                type: "post",
                url: "/chat/chat_directly",
                contentType: "application/json",
                async: true,
                data: json,
                success: (data, status) => {
                    if (data.result != 0) {
                        console.log("/chat/chat_directly ajax failed");
                    }
                    this.setState({ inputValue: "" });
                    this.setState({ isChatDisabled: false })
                    this.props.onChange();
                }
            });
            setTimeout(() => {
                this.props.onChange();
            }, 200);
        });
    }

    onChatBoxClear() {
        this.setState({ isChatDisabled: true }, () => {
            var json = JSON.stringify({
                userid : this.props.userid,
            });

            $.ajax({
                type: "post",
                url: "/user/newchatid",
                contentType: "application/json",
                data: json,
                async: false,
                success: (data, status) => {
                    if (status == "success") {
                        this.setState({ inputValue: "" });
                        this.setState({ isChatDisabled: false })
                        this.props.onChange();
                    } else {
                        console.log("/user/newchatid ajax failed");
                    }
                }
            });
        });
    }

    handleInputChange(event) {
        this.setState({ inputValue: event.target.value });
    }

    render() {
        return (
            <Space.Compact style={{ width: '100%' }}>
                <Input placeholder="输入你的问题"
                    value={this.state.inputValue}
                    onChange={this.handleInputChange.bind(this)}
                    onPressEnter={this.onChatBoxClick.bind(this)}
                    disabled={this.state.isChatDisabled} />
                <Button type="primary"
                    onClick={this.onChatBoxClick.bind(this)}
                    loading={this.state.isChatDisabled}>提问</Button>
                <Button
                    onClick={this.onChatBoxClear.bind(this)}
                    disabled={this.state.isChatDisabled}>清除记录</Button>
            </Space.Compact>
        )
    }
}
