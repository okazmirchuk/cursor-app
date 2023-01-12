import {useEffect, useState} from "react";
import io from "socket.io-client";
import randomColor from 'randomcolor'
import {useGetUser} from "./get-user";

const socket = io('ws://localhost:4000');

export const useConnection = () => {
    const userName = useGetUser()

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [userId, setUserId] = useState()
    const [userColor, setUserColor] = useState()

    useEffect(() => {
        const color = randomColor()
        socket.on('connect', () => {
            setIsConnected(true);
            setUserId(socket.id)
            setUserColor(color)

            socket.emit('USER_JOINED', {userName, userColor: color})
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, [isConnected]);

    return {
        isConnected,
        socket,
        userId,
        userColor,
        userName
    }
}
