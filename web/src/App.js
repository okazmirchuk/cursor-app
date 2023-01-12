import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

export default function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <BrowserRouter>
                <Routes>
                    <Route key={'/'} path={'/'} element={<Home/>}/>
                    <Route key={'/login'} path={'/login'} element={<Login/>}/>
                </Routes>
            </BrowserRouter>
        </DndProvider>
    );
}
