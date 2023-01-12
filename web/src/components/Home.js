import styled from 'styled-components'
import SharedSpace from "./SharedSpace";
import {useConnection} from "../hooks/connection";
import {Button, notification, Typography} from "antd";
import {Navigate} from "react-router-dom";
import {useGetUser} from "../hooks/get-user";
import {useEffect} from "react";
import {RotatingLines} from "react-loader-spinner";

const {Title} = Typography

export default function Home() {
    const {isConnected, socket, userColor, userName} = useConnection()
    const [notificationApi, contextHolder] = notification.useNotification();

    const user = useGetUser()

    useEffect(() => {
        socket.on('USER_JOINED', ({userName}) => {
            notificationApi.success({
                message: `${userName} joined the space`,
            })
        })

        socket.on('USER_LEFT', ({userName}) => {
            notificationApi.warning({
                message: `${userName} left the space`,
            })
        })
    }, [])

    return (
        <>
            {contextHolder}
            {!user && <Navigate to="/login"/>}
            <Layout>
                {!isConnected && <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />}
                <Container>
                    {isConnected && <>
                        <Header color={userColor}>
                            <div className="header-wrapper">
                                <Title level={4}>{user}</Title>
                                <div className="user-color"/>
                            </div>
                            <Button danger onClick={() => {
                                window.location.href = '/login'
                            }}>Leave</Button>
                        </Header>
                        <SharedSpace socket={socket} userColor={userColor} userName={userName}/>
                    </>}
                </Container>
            </Layout>
        </>
    );
}

const Layout = styled.div`
  padding: 20px;
`

const Container = styled.div`
  width: 1300px;
  height: 700px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  > .header-wrapper {
    display: flex;
    align-items: center;
  }

  .user-color {
    height: 30px;
    width: 30px;
    background: ${({color}) => color};
  }

  h4 {
    margin: 0 10px 0 0;
  }

  > button {
    margin-left: auto;
  }
`
