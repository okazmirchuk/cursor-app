import {useSearchParams} from "react-router-dom";
import {useState} from "react";

export const useGetUser = () => {
    let [searchParams, setSearchParams] = useSearchParams();

    let [user, setUser] = useState(
        searchParams.get("user")
    );

    return user
}
