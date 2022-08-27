
import * as express from 'express';
import { ConfigureWebsocketServer } from './websocket';
import * as http from "http";
import { SERVER_PORT, RESTART_GAME_PATH } from './common/models/connection-config';
import * as cors from "cors";
import { EMPTY, Subject } from 'rxjs';

const expressServer = express();
// expressServer.use(cors);
const expressRouter = express.Router();
const httpServer = new http.Server(expressServer);
expressServer.use('/', expressRouter);

const restartGameSubject = new Subject<void>();
expressServer.post(RESTART_GAME_PATH, (_, res) => {
    console.log('-  restart game  -');
    restartGameSubject.next();
    res.end('game restarted');
});

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server is listening on port ${SERVER_PORT}`)
});

ConfigureWebsocketServer(httpServer, restartGameSubject);
