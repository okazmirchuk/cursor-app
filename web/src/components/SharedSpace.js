import styled from 'styled-components'
import {useEffect, useReducer, useRef, useState} from "react";
import wait from "wait";
import CursorSvg from "./Cursor";
import axios from "axios";
import {Typography, Button} from "antd";
import {useDrag, useDrop} from "react-dnd";
import {PauseCircleOutlined, PlayCircleOutlined, RedoOutlined, UndoOutlined} from "@ant-design/icons";
import {API_URL} from "../config";

const {Text} = Typography

function reducer(state, action) {
    switch (action.type) {
        case '':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1};
        default:
            throw new Error();
    }
}

const SharedSpace = ({socket, userName, userColor}) => {
    const [users, setUsers] = useState([])
    const [isPaused, setIsPaused] = useState(false)
    const [currentSlice, setCurrentSlice] = useState(0)
    const [state, dispatch] = useReducer(reducer, {});

    const [collectedProps, drop] = useDrop(() => ({
        accept: 'BOX'
    }))

    const [localMousePos, setLocalMousePos] = useState({});
    const ref = useRef(null)

    const [collected, drag, dragPreview] = useDrag(() => ({
        type: 'BOX',
        item: {id: 1}
    }))

    const handleMouseMove = async (event) => {
        const rect = ref.current.getBoundingClientRect()

        const x = (event.clientX) - rect.left;
        const y = (event.clientY) - rect.top;

        // const x = (event.pageX) - (event.target.offsetLeft || window.offsetLeft);
        // const y = (event.pageY) - (event.target.offsetTop || window.offsetTop);

        setLocalMousePos({x, y});

        await wait(120)

        // console.log(x, y, window.offsetLeft, event.clientX, event.target.offsetLeft);
        if ((localMousePos.x !== x || localMousePos.y !== y)) {
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

        console.log(API_URL);
        axios.get(`${API_URL}/users`).then(({data}) => {
            console.log(data.data);
            setUsers(data.data)
        })
    }, [])

    const renderCursors = () => users.filter(user => user.userId !== socket.id).map((user) => {
        return (
            <Cursor onClick={() => {
                console.log(user)
            }} key={user.userId} style={{
                width: 100,
                height: 30,
                position: 'absolute',
                transform: `translate(${user.x || 0}px, ${user.y || 0}px)`,
                transition: "transform 120ms linear",
            }}>
                <Text className="user-name">{user.userName}</Text>
                <CursorSvg color={user.userColor}/>

                {/*{collected.isDragging ? (*/}
                {/*    <div ref={dragPreview}/>*/}
                {/*) : (*/}
                {/*    <div ref={drag} {...collected}>*/}
                {/*        ...*/}
                {/*    </div>*/}
                {/*)}*/}
            </Cursor>
        )
    })

    return (
        <>
            <Buttons>
                <Button type="primary" shape="circle" disabled={!isPaused} icon={<RedoOutlined/>} size={"middle"}/>
                <Button type="primary" shape="circle" icon={isPaused ? <PlayCircleOutlined/> : <PauseCircleOutlined />} size={"middle"} onClick={() => {
                    setIsPaused(true)
                }}/>
                <Button type="primary" shape="circle" disabled={!isPaused} icon={<UndoOutlined/>} size={"middle"}/>
            </Buttons>
            <Container onMouseMove={handleMouseMove} className={"space"} ref={ref}>
                {renderCursors()}
                <Cursor style={{
                    width: 100,
                    height: 30,
                    position: 'fixed',
                    transform: `translate(${localMousePos.x || 0}px, ${localMousePos.y || 0}px)`,
                    // transition: "transform 120ms linear",
                }} onClick={() => {
                }}>
                    <Text className="user-name">{userName}</Text>
                    <CursorSvg color={userColor}/>
                </Cursor>
            </Container>
        </>
    )
}

const Cursor = styled.div`
  .user-name {
    position: absolute;
    left: 20px;
  }
`

const Container = styled.div`
  border: 1px solid rgba(5, 5, 5, 0.06);
  border-radius: 10px;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 9;
  cursor: none;
`

const Buttons = styled.div`
  margin-bottom: 20px;

  > button {
    margin-right: 10px;

    :last-child {
      margin-right: 0;
    }
  }
`

export default SharedSpace
