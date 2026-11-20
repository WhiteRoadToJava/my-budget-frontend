import { useEffect, useState } from "react";

const PHONE_QUERY = '(max-width: 640px)';

const matches = () => 
typeof window !== 'undefined' && typeof window.matchMedia === 'function'
? window.matchMedia(PHONE_QUERY).matches
: false;

export const useIsPhone = () => {
    const [isPhone, setIsPhone] = useState(matches);


    useEffect(() =>{
        if(typeof window.matchMedia !== 'function') return undefined;
        const query = window.matchMedia(PHONE_QUERY);
        const update = () => setIsPhone(query.matches);
        update();
        query.addEventListener("change", update);
        return() => query.removeEventListener("change", update);

    }, [])
    return isPhone;
}