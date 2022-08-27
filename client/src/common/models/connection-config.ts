export const SERVER_PORT = 3080;

export const WEBSOCKET_CHANNELS = {
    GAMESTATE: 'gamestate',
    PLAYER_ACTION: 'player-aciton'
} as const;

export const RESTART_GAME_PATH = '/restart-game'
