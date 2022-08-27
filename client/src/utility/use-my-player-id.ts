import { useEffect, useState } from "react";
import { Player } from "../common/models/game.model";

const playerIdStoreKey = 'playerIdStoreKey';

export interface PlayerGameId {
    playerId: Player['id'];
    gameId: string;
}

export function useMyPlayerId(): [PlayerGameId | undefined, (id: PlayerGameId | undefined) => void] {
    const [myPlayerId, setPlayerid] = useState<PlayerGameId | undefined>(
        localStorage.getItem(playerIdStoreKey) ? JSON.parse(localStorage.getItem(playerIdStoreKey)!) : undefined
    );

    useEffect(() => {
        if (myPlayerId !== undefined) {
            localStorage.setItem(playerIdStoreKey, JSON.stringify(myPlayerId));
        } else {
            localStorage.removeItem(playerIdStoreKey);
        }
    }, [myPlayerId]);

    return [myPlayerId, setPlayerid]
}
