import { useEffect, useState } from "react";

const playerNameStoreKey = 'playerNameStoreKey';


export function useMyStoredName(): [string | undefined, (v: string | undefined) => void] {
    const [myStoredName, setMyStoredName] = useState<string | undefined>(
        localStorage.getItem(playerNameStoreKey) ?? undefined
    );

    useEffect(() => {
        if (myStoredName === undefined) {
            localStorage.removeItem(playerNameStoreKey);
        } else {
            localStorage.setItem(playerNameStoreKey, myStoredName);
        }
    }, [myStoredName]);


    return [myStoredName, setMyStoredName]
}
