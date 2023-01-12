import {useEffect, useState} from "react";
import io from "socket.io-client";
import randomColor from 'randomcolor'
import {useGetUser} from "./get-user";
import {API_URL} from "../config";

export const socket = io(API_URL);

export const useConnection = () => {
    const userName = useGetUser()

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [userId, setUserId] = useState()
    const [userColor, setUserColor] = useState()

    console.log(isConnected, userName)
    useEffect(() => {
        const color = randomColor()
        socket.on('connect', () => {
            setIsConnected(true);
            setUserId(socket.id)
            setUserColor(color)

            socket.emit('USER_JOINED', {userName, userColor: color})
        });

        socket.on('disconnect', () => {
            console.log('disconnect 1')
            setIsConnected(false);
        });

        return () => {
            console.log('disconnect 2')
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
