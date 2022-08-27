import { GameState, Player } from "./game.model";

export interface PlayerActionCommon {
    playerId: Player['id'];
    action: PlayerActionType;
}

export enum PlayerActionType {
    META = 'META',
    FIGHT = 'FIGHT',
    END_TURN = 'END_TURN',
    START_GAME = 'START_GAME'
}

type ACTION_MAP = {
    [PlayerActionType.META]: PlayerActionMetaUpdate,
    [PlayerActionType.FIGHT]: PlayerActionFight,
    [PlayerActionType.END_TURN]: PlayerActionEndTurn,
    [PlayerActionType.START_GAME]: PlayerActionEndTurn
}

export interface PlayerActionMetaUpdate extends PlayerActionCommon {
    action: PlayerActionType.META,
    name?: string | null;
    powerLevel?: number;
    pause?: boolean;
}

export interface PlayerActionFight extends PlayerActionCommon {
    action: PlayerActionType.FIGHT,
    extraPowerLevel: number;
}

export interface PlayerActionEndTurn extends PlayerActionCommon {
    action: PlayerActionType.END_TURN;
}

export interface PlayerActionStartGame extends PlayerActionCommon {
    action: PlayerActionType.START_GAME;
}


export type PlayerAction =
    PlayerActionMetaUpdate |
    PlayerActionFight |
    PlayerActionEndTurn |
    PlayerActionStartGame;


export function PlayerActionResult(
    playerAction: PlayerAction,
    gameState: GameState,
    options: {
        [K in PlayerActionType]: (m: ACTION_MAP[K], gameState: GameState) => GameState | undefined;
    }
): GameState | undefined {
    const foo = Object.values(PlayerActionType).find((a) => {
        return playerAction.action === a;
    });
    return options[foo!](playerAction as any, gameState);
}
