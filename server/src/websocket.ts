
import * as SocketIo from "socket.io";
import * as http from "http";
import { PlayMunchkin } from "./game-logic";
import { PlayerAction } from "./common/models/player-actions.model";
import { WEBSOCKET_CHANNELS } from "./common/models/connection-config";
import { Observable, ReplaySubject, share, Subject } from "rxjs";

export function ConfigureWebsocketServer(httpServer: http.Server, restartGame: Observable<void>): void {
    const socketIoServer = new SocketIo.Server(httpServer, {
        cors: {
          origin: "http://localhost:3000"
        }
    });


    const playerActions = new Subject<PlayerAction>();
    const game = PlayMunchkin(playerActions, restartGame).pipe(
        share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: true })
    );

    socketIoServer.on('connection', (connection) => {
        console.warn('a player has connected');

        const sub = game.subscribe((g) => connection.emit(WEBSOCKET_CHANNELS.GAMESTATE, JSON.stringify(g)));
        connection.on('disconnect', () => {
            sub.unsubscribe();
            console.log('a player has disconnected');
        });

        connection.on(WEBSOCKET_CHANNELS.PLAYER_ACTION, (a) => {
            console.log('player has sent action', a);
            playerActions.next(JSON.parse(a));
        });
    })
}
