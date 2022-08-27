import { useEffect, useState } from "react";
import { GameStateUtility, Player } from "../common/models/game.model";
import { useGameState } from "./use-game-state";
import { useMyPlayerId } from "./use-my-player-id";


export function useMyGamePlayer(): [Player | undefined, boolean] {
    const [gameState] = useGameState();
    const [myPlayerId] = useMyPlayerId();
    const [player, setPlayer] = useState<Player | undefined>(undefined);
    const [myTurn, setMyTurn] = useState<boolean>(false);

    useEffect(() => {
        if (gameState && myPlayerId && GameStateUtility.PlayerIsInGame(gameState, myPlayerId.playerId, myPlayerId.gameId)) {
            setPlayer(gameState.players[myPlayerId.playerId]);
            setMyTurn(myPlayerId.playerId === gameState.currentPlayerId)
        }
    }, [gameState, myPlayerId]);

    return [player, myTurn];
}
