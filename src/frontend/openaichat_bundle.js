import React from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import { Input, Button, Space } from 'antd';
import { List, Avatar } from 'antd';
import $ from 'jquery';

const { Header, Content, Footer } = Layout;

class ChatWindow extends React.Component {
    constructor(props) {
        super(props);
        this.chatWindowRef = React.createRef();
        console.log("contentHeight" + this.props.contentHeight);

        this.state = {
            humanAvatar: "./image/human.png",
            AIAvatar: "./image/ai.png",
            dataSource: [],
        }
    }

    RefreshDataSource() {
        $.ajax({
            type: "get",
            url: "/get_all_chat",
            contentType: "application/json",
            success: (data, status) => {
                if (status == "success") {
                    console.log(data);
                    this.setState({ dataSource: data });
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
                                <div style={{ fontSize: 16, wordWrap : "break-word",  whiteSpace: "pre-wrap" }}>{item.content}</div>
                                <div style={{ fontSize: 10 }}>{item.time}</div>
                            </Space>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            isChatDisabled: false
        };
    }

    onChatBoxClick() {
        this.setState({ isChatDisabled: true }, () => {
            $.ajax({
                type: "post",
                url: "/get_answer_directly",
                contentType: "application/json",
                async: true,
                data: JSON.stringify({ input: this.state.inputValue }),
                success: (data, status) => {
                    if (data.result == 0) {
                        console.log("ajax ok");
                    } else {
                        console.log("ajax failed");
                    }
                    this.setState({ inputValue: "" });
                    this.setState({ isChatDisabled: false })
                    this.props.onChange();
                }
            });
        });
    }

    onChatBoxClear() {
        this.setState({ isChatDisabled: true }, () => {
            $.ajax({
                type: "get",
                url: "/clear_chat",
                contentType: "application/json",
                success: (data, status) => {
                    if (status == "success") {
                        this.setState({ inputValue: "" });
                        this.setState({ isChatDisabled: false })
                        this.props.onChange();
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

class RootContext extends React.Component {
    constructor(props) {
        super(props);
        this.HeaderRef = React.createRef();
        this.FooterRef = React.createRef();
        this.ChatWindoRef = React.createRef();
        this.ChatBoxRef = React.createRef();

        this.state = {
            ContextHeight: 0,
            CheckWindowHeight: 0
        }
    }

    componentDidMount() {
        var HeaderHeight = this.HeaderRef.current.offsetHeight;
        var FooterHeight = this.FooterRef.current.offsetHeight;
        var CheckBoxHeight = this.ChatBoxRef.current.offsetHeight;
        var WindowHeight = $(window).height();
        var ContextHeight = WindowHeight - HeaderHeight - FooterHeight * 2;
        var CheckWindowHeight = ContextHeight - CheckBoxHeight;

        console.log("WindowHeight:" + WindowHeight);
        console.log("HeaderHeight:" + HeaderHeight);
        console.log("FooterHeight:" + FooterHeight);
        console.log("ContextHeight:" + ContextHeight);
        console.log("CheckBoxHeight:" + CheckBoxHeight);
        console.log("CheckWindowHeight:" + CheckWindowHeight);
        this.setState({
            ContextHeight: ContextHeight,
            CheckWindowHeight: CheckWindowHeight
        })
    }

    onChatBoxChange() {
        console.log("onChatBoxChange");
        this.ChatWindoRef.current.RefreshDataSource();
    }

    render() {
        return (
            <Layout style={{ display: 'flex', flexDirection: 'column' }}>
                <Header ref={this.HeaderRef}>
                    <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', color: 'white' }}>OpenAIChat Test</div>
                </Header>
                <Content style={{ flex: '1 0 auto', padding: 24, margin: 0, width: "100%", height: this.state.ContextHeight }}>
                    <div style={{ width: "100%", height: "100%" }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex', width: "100%" }}>
                                <ChatWindow ref={this.ChatWindoRef} contentHeight={this.state.CheckWindowHeight} />
                                <div ref={this.ChatBoxRef}>
                                    <ChatBox onChange={this.onChatBoxChange.bind(this)} />
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