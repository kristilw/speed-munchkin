import { useEffect, useState } from "react";
import { Player, GameStateUtility } from "../common/models/game.model";
import { PlayerAction } from "../common/models/player-actions.model";
import { Game, PlayerActionNoId } from "../model/game";
import { emitPlayerAction, useGameState } from "./use-game-state";
import { PlayerGameId, useMyPlayerId } from "./use-my-player-id";

export function useGame(): [Game | undefined, (id: PlayerGameId | undefined) => void] {
    const gameState = useGameState();
    const [myPlayerId, setMyPlayerId] = useMyPlayerId();
    const [myPlayer, setMyPlayer] = useState<Player | undefined>(undefined);
    const [myTurn, setMyTurn] = useState<boolean>(false);
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(undefined);

    useEffect(() => {
        if (gameState) {
            setCurrentPlayer(gameState.players[gameState.currentPlayerId]);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState && myPlayerId && GameStateUtility.PlayerIsInGame(gameState, myPlayerId.playerId, myPlayerId.gameId)) {
            setMyPlayer(gameState.players[myPlayerId.playerId]);
            setMyTurn(myPlayerId.playerId === gameState.currentPlayerId)
        } else {
            setMyPlayer(undefined);
            setMyTurn(false);
        }
    }, [gameState, myPlayerId]);

    if (gameState && currentPlayer && myPlayer) {
        return [{
            state: gameState,
            currentPlayer: currentPlayer,
            meInGame: {
                myTurn: myTurn,
                myPlayer: myPlayer,
                emitAction: (action: PlayerActionNoId) => {
                    emitPlayerAction({
                        ...action,
                        playerId: myPlayer.id
                    } as PlayerAction);
                }
            }
        }, setMyPlayerId]
    }

    if (gameState && currentPlayer) {
        return [{
            state: gameState,
            currentPlayer: currentPlayer,
            meInGame: undefined
        }, setMyPlayerId]
    }

    return [undefined, setMyPlayerId];
}
