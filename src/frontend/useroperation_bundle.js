import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Alert } from 'antd';
import { HeaderBar } from './component/headerbar.js'
import { LoginForm } from './component/loginform.js'
import { RegisterForm } from './component/registerform.js'
import { ChangePasswordForm } from './component/changePassword.js'
import $ from 'jquery';

const { Header, Content, Footer } = Layout;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }

    return (false);
}

const operationData = [
    {
        operation: "login",
        title: "登录",
        alert_msg: "登录失败，请检查用户名和密码",
    },
    {
        operation: "register",
        title: "注册",
        alert_msg: "注册失败, 此邮箱已经被人注册",
    },
    {
        operation: "changepassword",
        title: "修改密码",
        alert_msg: "修改失败, 此用户不存在",
    }
]

class RootContext extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.HeaderRef = React.createRef();
        this.FooterRef = React.createRef();

        this.state = {
            ContextHeight: 0,
            showError: false,
            user: {
                result: -1,
                userid: "",
                username: "",
                isAdmin: false
            },
            operation: "",
            title: "",
            alert_msg: "",
        }
    }

    componentWillMount() {
        var operation = getQueryVariable("op");
        if (operation == false) {
            operation = "login";
        }

        this.setState({ operation: operation });

        operationData.some((element) => {
            if (element.operation == operation) {
                this.setState({ title: element.title, alert_msg: element.alert_msg });
            }
        })
    }

    componentDidMount() {
        var HeaderHeight = this.HeaderRef.current.offsetHeight;
        var FooterHeight = this.FooterRef.current.offsetHeight;
        var WindowHeight = $(window).height();
        var ContextHeight = WindowHeight - HeaderHeight - FooterHeight * 2;

        this.setState({
            ContextHeight: ContextHeight,
        })
    }


    showError(on) {
        this.setState({ showError: on });
    }

    getAlert() {
        if (this.state.showError) {
            return (<div style={{ marginBottom: 20 }}><Alert message={this.state.alert_msg} type="error" showIcon closable /></div>);
        }
        else {
            return (<div />);
        }
    }

    getForm() {
        if (this.state.operation == "login") {
            return (
                <LoginForm showError={this.showError.bind(this)} />
            )
        } else if (this.state.operation == "register") {
            return (
                <RegisterForm showError={this.showError.bind(this)} />
            )
        } else if (this.state.operation == "changepassword") {
            return (
                <ChangePasswordForm showError={this.showError.bind(this)} />
            )
        } else {
            return (
                <div />
            )
        }
    }

    render() {
        var height = $(window).height() - 64;

        return (
            <Layout style={{ display: 'flex', flexDirection: 'column' }}>
                <div ref={this.HeaderRef} >
                    <HeaderBar user={this.state.user} />
                </div>
                <Content style={{ flex: '1 0 auto', padding: 24, margin: 0, width: "100%", height: this.state.ContextHeight }}>
                    <div style={{ width: "100%", height: "100%" }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="login-form centerblock2">
                                {this.getAlert()}
                                {this.getForm()}
                            </div>
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