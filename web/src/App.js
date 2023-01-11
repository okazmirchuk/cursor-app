import {useEffect} from 'react';
import {useState} from 'react';
import CursorSvg from "./Cursor";
import wait from 'wait';
import styled from 'styled-components'
import SharedSpace from "./Components/SharedSpace";
import {RotatingLines} from "react-loader-spinner";
import {useConnection} from "./hooks/connection";

export default function App() {
    const {isConnected, socket} = useConnection()

    console.log(isConnected);
    const [userCordinates, setUserCordinates] = useState({});
    const [localMousePos, setLocalMousePos] = useState({});

    const handleMouseMove = async (event) => {
        // 👇 Get mouse position relative to element
        const localX = event.clientX - event.target.offsetLeft;
        const localY = event.clientY - event.target.offsetTop;

        await wait(300)

        setLocalMousePos({x: localX, y: localY});
        if (localMousePos.x !== localX || localMousePos.y !== localY) {
            socket.emit('move-cursor', {
                x: localX, y: localY, userId: socket.id
            })
        }
    };

    useEffect(() => {
        const handleMouseMove = (event) => {
            setUserCordinates({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        socket.on('UPDATE_CURSOR_COORDINATES', (data) => {
            console.log('update: ', data);
        })

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };

    }, []);

    return (
        <Layout>
            {/*<div*/}
            {/*    style={{*/}
            {/*        border: '1px solid gray',*/}
            {/*        display: 'inline-block',*/}
            {/*        padding: '75px',*/}
            {/*        textAlign: 'center',*/}
            {/*        width: 500,*/}
            {/*        height: 500,*/}
            {/*    }}*/}
            {/*    onMouseMove={handleMouseMove}*/}
            {/*>*/}
            {/*    Local*/}
            {/*    <br/>*/}
            {/*    <b>*/}
            {/*        ({localMousePos.x}, {localMousePos.y})*/}
            {/*    </b>*/}
            {/*</div>*/}

            {!isConnected && <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
            />}
            {isConnected && <>
                <Header>
                    <div>Welcome Oleksandr</div>
                    <div/>
                </Header>
                <SharedSpace/>
                {/*<div*/}
                {/*    style={{*/}
                {/*        border: '1px solid gray',*/}
                {/*        display: 'inline-block',*/}
                {/*        padding: '75px',*/}
                {/*        textAlign: 'center',*/}
                {/*        width: 500,*/}
                {/*        height: 500,*/}
                {/*        marginLeft: 50,*/}
                {/*        position: 'relative',*/}
                {/*    }}*/}
                {/*    onMouseMove={handleMouseMove}*/}
                {/*>*/}
                {/*    Local*/}
                {/*    <br/>*/}
                {/*    <b>*/}
                {/*        <div style={{*/}
                {/*            width: 30,*/}
                {/*            height: 30,*/}
                {/*            position: 'absolute',*/}
                {/*            left: userCordinates.x,*/}
                {/*            top: userCordinates.y,*/}
                {/*            // transform: `translate(${userCordinates.x}px, ${userCordinates.y}px)`,*/}
                {/*            transition: "transform 120ms linear",*/}
                {/*        }}>*/}
                {/*            <span>Oleksandr</span>*/}
                {/*            <CursorSvg color={"red"}/>*/}
                {/*        </div>*/}
                {/*        ({localMousePos.x}, {localMousePos.y})*/}
                {/*    </b>*/}
                {/*</div>*/}

            </>}
        </Layout>
    );
}

const Layout = styled.div`
  padding: 20px;
`

const Header = styled.div`
  display: flex;
  align-items: center;

  > div:first-child {
    margin-right: 10px;
  }

  > div:nth-child(2) {
    height: 30px;
    width: 30px;
    background: red;
  }
`
