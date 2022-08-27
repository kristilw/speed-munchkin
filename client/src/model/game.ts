import { GameState, Player } from "../common/models/game.model";
import {
    PlayerActionEndTurn,
    PlayerActionFight,
    PlayerActionMetaUpdate, 
    PlayerActionStartFight,
    PlayerActionStartGame
} from "../common/models/player-actions.model";

export type PlayerActionNoId =
    Omit<PlayerActionMetaUpdate, 'playerId'> |
    Omit<PlayerActionFight, 'playerId'> |
    Omit<PlayerActionEndTurn, 'playerId'> |
    Omit<PlayerActionStartGame, 'playerId'> |
    Omit<PlayerActionStartFight, 'playerId'>;

export interface Game<T extends GameState = GameState> {
    state: T;
    currentPlayer: Player;
    meInGame: {
        myTurn: boolean;
        myPlayer: Player;
        emitAction: (action: PlayerActionNoId) => void;
    } | undefined;
}
