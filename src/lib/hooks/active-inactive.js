import {React,useState,useEffect} from 'react';
import {scrollToTop} from "../../components/configaration/company/Company";
import {useDispatch} from "react-redux";

export function useActiveInactive(action) {
    if (typeof action !== 'function') throw "Thunk action should be a function";

    const dispatch = useDispatch();
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        dispatch(action(isActive))
        scrollToTop();
    }, [isActive]);

    return {
        setIsActive,
        isActive
    }
}