
export interface Player {
    id: 0 | 1 | 2 | 3 | 4 | 5;
    name?: string;
    powerLevel: number;
    paused: boolean;
    isDead: boolean;
    timeIsRunning: boolean;

    timeLeft_ms: number;
    bonusTimeLeft_ms: number;
}

export interface GameStateCommon {
    id: string;
    updatedAt_epoch_ms: number;
    playerStartedRoundAt_epoch_ms: number | undefined;
    currentPlayerId: Player['id'];
    players: Record<Player['id'], Player>;
}

export interface GameStateOpeningDoor extends GameStateCommon {
    state: 'OPENING_DOOR';
}

export interface GameStateFighting extends GameStateCommon {
    state: 'FIGHTNING'
    monsterPowerLevel: number;

    actionsOfOtherPlayers: Array<{
        playerId: Player;
        powerLevel: number;
    }>
}

export interface GameStateAfterFight extends GameStateCommon {
    state: 'AFTER_FIGHT'
}

export interface GameStateLobby extends GameStateCommon {
    state: 'LOBBY'
}

export interface GameStateFinished extends GameStateCommon {
    state: 'FINISHED',
    winner: Player['id']
}

export type GameState =
    GameStateOpeningDoor |
    GameStateFighting |
    GameStateAfterFight |
    GameStateLobby |
    GameStateFinished;

export class GameStateUtility {
    static IsGamePaused(state: GameState): boolean {
        return GameStateUtility.GetAllPlayersInGame(state).some((p) => p.paused) || state.state === 'LOBBY'
    }

    static PlayerIsInGame(state: GameState, playerId: Player['id'], gameId: string): boolean {
        return state.id === gameId && GameStateUtility.GetAllPlayersInGame(state).some((p) => p.id === playerId);
    }

    static GetAllPlayersInGame(state: GameState): Array<Player> {
        return Object.values(state.players).filter((p) => p.name !== undefined);
    }

    static GetAllAlivePlayers(state: GameState): Array<Player> {
        return GameStateUtility.GetAllPlayersInGame(state).filter((p) => p.isDead === false);
    }

    static IsItThisPlayersTurn(state: GameState, myId: Player['id']): boolean {
        return state.currentPlayerId === myId;
    }
}
