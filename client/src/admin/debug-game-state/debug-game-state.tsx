
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import { SERVER_PORT, WEBSOCKET_CHANNELS } from '../../common/models/connection-config';
import { GameState } from "../../common/models/game.model";
import { restartGame } from "../../utility/restart-game";

function DebugGameStateComponent() {
    const [gameState, setGameState] = useState<GameState | undefined>(undefined);

    useEffect(() => {
        const socket = io("ws://localhost:" + SERVER_PORT);

        console.log('connect');

        socket.on(WEBSOCKET_CHANNELS.GAMESTATE, (arg) => {
            setGameState(JSON.parse(arg));
        });
    }, []);

    
    return (
        <div>
            <button onClick={restartGame}>
                Create new lobby
            </button>
            <div>
                {JSON.stringify(gameState)}
            </div>
        </div>
    );
}

export default DebugGameStateComponent;
