import {useEffect, useState} from "react";
import io from "socket.io-client";

export const useConnection = () => {
    const socket = io('ws://localhost:4000');

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, []);

    return {
        isConnected,
        socket
    }
}
