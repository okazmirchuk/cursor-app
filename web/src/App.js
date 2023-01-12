import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route key={'/'} path={'/'} element={<Home/>}/>
                <Route key={'/login'} path={'/login'} element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    );
}
