import styled from 'styled-components'
import {useEffect, useRef, useState} from "react";
import wait from "wait";
import CursorSvg from "./Cursor";
import axios from "axios";
import {Typography, Button} from "antd";
import {PauseCircleOutlined, PlayCircleOutlined, RedoOutlined, UndoOutlined} from "@ant-design/icons";
import {API_URL} from "../config";

const {Text} = Typography

const calculateHistoryLength = (history) => {
    const histories = []

    for (const item in history) {
        histories.push(history[item].mouseTrack.length)
    }

    return Math.max(...histories)
}

const SharedSpace = ({socket, userName, userColor, userId}) => {
    const [users, setUsers] = useState([])
    const [isPaused, setIsPaused] = useState(false)
    const [history, setHistory] = useState({})
    const [historyLength, setHistoryLength] = useState(0)
    const [historyCursor, setHistoryCursor] = useState(0)

    const [localMousePos, setLocalMousePos] = useState({});
    const ref = useRef(null)

    const handleMouseMove = async (event) => {
        const rect = ref.current.getBoundingClientRect()

        const x = (event.clientX) - rect.left;
        const y = (event.clientY) - rect.top;

        if (isPaused) return

        setLocalMousePos({x, y});

        const mouseTrack = history[socket.id]?.mouseTrack || []

        setHistory({
            ...history,
            [socket.id]: {
                mouseTrack: [...mouseTrack, {x, y}]
            }
        })

        await wait(120)

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
                        const mouseTrack = history[userId]?.mouseTrack || []

                        setHistory({
                            ...history,
                            [userId]: {
                                mouseTrack: [...mouseTrack, {x, y}]
                            }
                        })

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
    }, [users.length, history])

    useEffect(() => {
        socket.on('USER_JOINED', (user) => {
            setUsers([...users, user])
        })

        socket.on('USER_LEFT', ({userId}) => {
            setUsers(users.filter(user => user.userId !== userId))
        })

        axios.get(`${API_URL}/users`).then(({data}) => {
            setUsers(data.data)
        })
    }, [])

    const renderCursors = () => users.filter(user => user.userId !== socket.id).map((user) => {
        return (
            <Cursor onClick={() => {
                alert(user.userName)
            }} key={user.userId} style={{
                width: 100,
                height: 30,
                position: 'absolute',
                transform: `translate(${user.x || 0}px, ${user.y || 0}px)`,
                transition: "transform 120ms linear",
            }}>
                <Text className="user-name">{user.userName}</Text>
                <CursorSvg color={user.userColor}/>
            </Cursor>
        )
    })

    return (
        <>
            <Buttons>
                <Button type="primary" shape="circle" disabled={!isPaused || historyCursor === 0} icon={<RedoOutlined/>}
                        size={"middle"} onClick={() => {
                    for (const historyItem in history) {
                        const mouseTrack = history[historyItem].mouseTrack

                        const {
                            x,
                            y
                        } = mouseTrack[historyCursor - 1]

                        if (userId === historyItem) {
                            setLocalMousePos({
                                x, y
                            })
                        } else {
                            setUsers([...users.map(user => {
                                if (user.userId === historyItem) {
                                    return {
                                        ...user,
                                        x,
                                        y,
                                    }
                                }

                                return user
                            })])
                        }
                    }

                    setHistoryCursor(historyCursor - 1)
                }}/>
                <Button type="primary" shape="circle" icon={isPaused ? <PlayCircleOutlined/> : <PauseCircleOutlined/>}
                        size={"middle"} onClick={() => {
                    if (!isPaused) {
                        const maxLength = calculateHistoryLength(history)

                        for (const historyItem in history) {
                            const itemLength = history[historyItem].mouseTrack.length

                            const diff = maxLength - itemLength

                            if (diff > 0) {
                                const lastPosition = history[historyItem].mouseTrack[0]

                                const filledArray = new Array(diff).fill(lastPosition)

                                setHistory({
                                    ...history,
                                    [historyItem]: {
                                        mouseTrack: [...filledArray, ...history[historyItem].mouseTrack]
                                    }
                                })
                            }
                        }

                        console.log(history);
                        setHistoryLength(maxLength)
                        setHistoryCursor(maxLength)
                    } else {
                        axios.get(`${API_URL}/users`).then(({data}) => {
                            setUsers(data.data)

                            const me = data.data.find(user => user.userId === userId)

                            setLocalMousePos({
                                x: me.x,
                                y: me.y
                            })

                            setIsPaused(false)
                            setHistoryLength(0)
                            setHistoryCursor(0)
                            setHistory({})
                        })

                    }

                    setIsPaused(true)
                }}/>
                <Button type="primary" shape="circle" disabled={!isPaused || historyCursor >= historyLength}
                        icon={<UndoOutlined/>} size={"middle"} onClick={() => {
                    for (const historyItem in history) {
                        const {x, y} = history[historyItem].mouseTrack[historyCursor]

                        if (userId === historyItem) {
                            setLocalMousePos({
                                x, y
                            })
                        } else {
                            setUsers([...users.map(user => {
                                if (user.userId === historyItem) {
                                    return {
                                        ...user,
                                        x,
                                        y,
                                    }
                                }
                            })])
                        }
                    }

                    setHistoryCursor(historyCursor + 1)
                }}/>
            </Buttons>
            <Container onMouseMove={handleMouseMove} className={"space"} ref={ref}>
                {renderCursors()}
                <Cursor style={{
                    width: 100,
                    height: 30,
                    position: 'fixed',
                    transform: `translate(${localMousePos.x || 0}px, ${localMousePos.y || 0}px)`,
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
