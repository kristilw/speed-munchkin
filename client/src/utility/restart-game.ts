import { RESTART_GAME_PATH } from "../common/models/connection-config";

export function restartGame() {
    const requestOptions = {
        method: 'POST'
    };
    // eslint-disable-next-line no-restricted-globals
    fetch(location.protocol + '//' + location.host + RESTART_GAME_PATH, requestOptions)
}
