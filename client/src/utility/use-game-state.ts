import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { WEBSOCKET_CHANNELS } from "../common/models/connection-config";
import { GameState } from "../common/models/game.model";
import { PlayerAction } from "../common/models/player-actions.model";

// eslint-disable-next-line no-restricted-globals
const socket = io("ws://" + location.host);
let latestGameState: GameState | undefined;

export function useGameState(): GameState | undefined {
    const [gameState, setGameState] = useState<GameState | undefined>(latestGameState);

    useEffect(() => {
        function listen(arg: any) {
            latestGameState = (JSON.parse(arg) as GameState);
            setGameState(latestGameState);
        }

        socket.on(WEBSOCKET_CHANNELS.GAMESTATE, listen);
        return () => {
            socket.removeListener(WEBSOCKET_CHANNELS.GAMESTATE, listen)
        };
    }, []);

    return gameState
}

export function emitPlayerAction(action: PlayerAction): void {
    socket.emit(WEBSOCKET_CHANNELS.PLAYER_ACTION, JSON.stringify(action));
}
