
import { useEffect, useState } from "react";
import { Player } from "../common/models/game.model";
import { useGameState } from "./use-game-state";

export function useCurrentPlayer(): [Player | undefined] {
    const [gameState] = useGameState();
    const [player, setPlayer] = useState<Player | undefined>(undefined);

    useEffect(() => {
        if (gameState) {
            setPlayer(gameState.players[gameState.currentPlayerId]);
        }
    }, [gameState]);

    return [player];
}
