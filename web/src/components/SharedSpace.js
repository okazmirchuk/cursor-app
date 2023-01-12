import styled from 'styled-components'
import {useEffect, useState} from "react";
import wait from "wait";
import CursorSvg from "./Cursor";
import axios from "axios";
import {Typography} from "antd";

const {Text} = Typography

const SharedSpace = ({socket}) => {
    const [users, setUsers] = useState([])

    const [localMousePos, setLocalMousePos] = useState({});

    const handleMouseMove = async (event) => {
        const x = event.clientX - event.target.offsetLeft;
        const y = event.clientY - event.target.offsetTop;

        await wait(120)

        setLocalMousePos({x, y});

        if (localMousePos.x !== x || localMousePos.y !== y) {
            socket.emit('MOVE_CURSOR', {
                x, y, userId: socket.id
            })
        }
    };

    useEffect(() => {
        socket.on('UPDATE_CURSOR_COORDINATES', ({x, y, userId}) => {
            const updatedUsers =
                users.map((user) => {
                    if (user.userId === userId) {
                        return {
                            ...user,
                            x,
                            y
                        }
                    }

                    return user
                })

            setUsers(updatedUsers)
        })
    }, [JSON.stringify(users)])

    useEffect(() => {
        socket.on('USER_JOINED', (user) => {
            setUsers([...users, user])
        })

        socket.on('USER_LEFT', ({userId}) => {
            console.log('user left: ', userId);
            setUsers(users.filter(user => user.userId !== userId))
        })

        axios.get('http://localhost:4000/users').then(({data}) => {
            setUsers(data.data)
        })
    }, [])

    const renderCursors = () => users.map((user) => {
        return (
            <div key={user.userId} style={{
                width: 30,
                height: 30,
                position: 'absolute',
                transform: `translate(${user.x || 0}px, ${user.y || 0}px)`,
                transition: "transform 120ms linear",
            }}>
                <Text className="user-name">{user.userName}</Text>
                <CursorSvg color={user.userColor}/>
            </div>
        )
    })

    return (
        <Container onMouseMove={handleMouseMove}>
            {renderCursors()}
        </Container>
    )
}

const Container = styled.div`
  border: 1px solid rgba(5, 5, 5, 0.06);
  border-radius: 10px;
  width: 100%;
  height: 100%;
  position: relative;

  .user-name {

  }
`

export default SharedSpace
