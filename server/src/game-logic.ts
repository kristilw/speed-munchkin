import { BehaviorSubject, filter, map, mergeWith, Observable, startWith, Subject, switchMap, timer } from "rxjs";
import { GameState, GameStateUtility, Player } from "./common/models/game.model";
import { PlayerAction, PlayerActionResult } from "./common/models/player-actions.model";

const playerOrder = [0, 1, 2, 3, 4, 5] as const;

const TIME_CONSTS = {
    EXTRA_TIME_ON_NEW_ROUND_MS: 15000,
    EXTRA_TIME_WHEN_FIGHT_MS: 15000,
    TIME_LEFT_START_MS: 100000
} as const;

function UpdatePlayer(player: Partial<Player>, gameState: GameState): GameState {
    return {
        ...gameState,
        players: {
            ...gameState.players,
            [player.id!]: {
                ...gameState.players[player.id!],
                ...player
            }
        }
    }
}

function IsDefined(v?: GameState): v is GameState {
    return !!v;
}

export function PlayMunchkin(
    playerActions: Observable<PlayerAction>, restartGame: Observable<void>
): Observable<GameState> {
    return restartGame.pipe(
        startWith({}),
        switchMap(() => {
            console.log('-------------------');
            console.log('-     NEW GAME    -');
            console.log('-------------------');

            const gameState = new BehaviorSubject<GameState>({
                id: Math.floor(Math.random() * 100000).toString(),
                updatedAt_epoch_ms: new Date().getTime(),
                playerStartedRoundAt_epoch_ms: undefined,
                state: 'LOBBY',
                currentPlayerId: 0,
                players: playerOrder.reduce((c, id) => {
                    c[id] = {
                        id: id,
                        powerLevel: 1,
                        paused: true,
                        timeLeft_ms: TIME_CONSTS.TIME_LEFT_START_MS,
                        bonusTimeLeft_ms: 0,
                        isDead: true
                    } as Player;
                    return c;
                }, {} as GameState['players'])
            });
        
            const gameStateUpdatesBecauseOfTimer = new Subject<GameState>();
        
            function UpdateTimeLeftOnPlayer(state: GameState): GameState {
                const player = state.players[state.currentPlayerId];
                if (state.playerStartedRoundAt_epoch_ms) {
                    player.timeLeft_ms = Math.max(player.timeLeft_ms - (new Date().getTime() - state.playerStartedRoundAt_epoch_ms), 0);
                    state.playerStartedRoundAt_epoch_ms = undefined;
                }
                return state;
            }
        
            function endTurn(state: GameState): GameState {
                state = UpdateTimeLeftOnPlayer(state);

                state = UpdatePlayer({
                    id: state.currentPlayerId,
                    timeLeft_ms: state.players[state.currentPlayerId].timeLeft_ms + TIME_CONSTS.EXTRA_TIME_ON_NEW_ROUND_MS
                }, state);
        
                const playersLeft = GameStateUtility.GetAllAlivePlayers(state);
                if (playersLeft.length > 1) {
                    let nextPlayerId = undefined;
                    let nextPlayerIdTmp = state.currentPlayerId;
                    while (nextPlayerId === undefined) {
                        nextPlayerIdTmp = (playerOrder.indexOf(nextPlayerIdTmp) + 1) % playerOrder.length as typeof playerOrder[number];
                        if (state.players[nextPlayerIdTmp].isDead === false) {
                            nextPlayerId = nextPlayerIdTmp
                        }
                    }
                    return {
                        ...state,
                        currentPlayerId: nextPlayerId,
                        playerStartedRoundAt_epoch_ms: new Date().getTime(),
                        state: 'OPENING_DOOR'
                    };
                } else {
                    return {
                        ...state,
                        playerStartedRoundAt_epoch_ms: undefined,
                        winner: playersLeft[0].id,
                        state: 'FINISHED'
                    };
                }
            }
        
            playerActions.pipe(
                map((action) => {
                    return PlayerActionResult(
                        action, gameState.value, {
                            START_GAME: (startGameAction, state) => {
                                console.warn('STARTING GAME');
                                Object.keys(state.players).forEach((playerId) => {
                                    const player = (state.players as any)[playerId] as Player;
                                    if (player.name) {
                                        player.isDead = false;
                                    } else {
                                        player.paused = false;
                                    }
                                });
                                return {
                                    ...state,
                                    state: 'OPENING_DOOR'
                                }
                            },
                            META: (metaAction, state) => {
                                const player = state.players[metaAction.playerId];
                                player.name = metaAction.name === null ? undefined : (metaAction.name ?? player.name);
                                player.powerLevel = metaAction.powerLevel ?? player.powerLevel;
                                player.paused = metaAction.pause ?? player.paused;
        
                                return UpdatePlayer(player, state);
                            },
                            START_FIGHT: (startFightAction, state) => {
                                if (state.currentPlayerId !== startFightAction.playerId) {
                                    return undefined;
                                }

                                return {
                                    ...UpdatePlayer({
                                        id: state.currentPlayerId,
                                        timeLeft_ms: state.players[state.currentPlayerId].timeLeft_ms + TIME_CONSTS.EXTRA_TIME_WHEN_FIGHT_MS
                                    }, state),
                                    state: 'FIGHTNING',
                                    monsterPowerLevel: startFightAction.monsterLevel,
                                    actionsOfOtherPlayers: []
                                }
                            },
                            FIGHT: (fightAction) => undefined,
                            END_TURN: (endTurnAction, state) => {
                                if (endTurnAction.playerId !== state.currentPlayerId) {
                                    return;
                                }
                                return endTurn(state);
                            }
                        }
                    )
                }),
                filter(IsDefined),
                startWith(gameState.value),
                mergeWith(gameStateUpdatesBecauseOfTimer),
                switchMap((state) => {
                    return new Observable<GameState>((o) => {
                        UpdateTimeLeftOnPlayer(state);
        
                        if (GameStateUtility.IsGamePaused(state) || state.state === 'FINISHED') {
                            console.warn('game paused');
                            o.next(state);
                            return () => {};
                        }
        
                        state.playerStartedRoundAt_epoch_ms = new Date().getTime();
                        o.next(state);
        
                        const currentPlayer = state.players[state.currentPlayerId];
                        console.log('kill player ' + currentPlayer.id + ' in ' + currentPlayer.timeLeft_ms + 'ms');
                        const sub = timer(currentPlayer.timeLeft_ms).subscribe(() => {
                            console.warn('player ' + currentPlayer.id + ' is dead');
                            gameStateUpdatesBecauseOfTimer.next(
                                endTurn(
                                    UpdatePlayer({
                                        id: currentPlayer.id,
                                        isDead: true
                                    }, gameState.value)
                                )
                            );
                        });
        
                        return () => sub.unsubscribe();
                    })
                }),
                map((state) => ({
                    ...state,
                    updatedAt: new Date()
                }))
            ).subscribe((v) => {
                console.log('update game state');
                gameState.next(v);
            });
        
            return gameState;
        })
    );
}
