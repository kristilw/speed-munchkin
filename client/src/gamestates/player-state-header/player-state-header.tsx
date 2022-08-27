import { GameStateUtility } from '../../common/models/game.model';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { useGameState } from '../../utility/use-game-state';
import { useMyGamePlayer } from '../../utility/use-my-game-player';
import CountdownComponent from '../countdown/countdown';
import './player-state-header.scss';

function PlayerStateHeaderComponent() {
    const [gameState, setPlayerAction] = useGameState();
    const [myPlayer, myTurn] = useMyGamePlayer();

    if (gameState && myPlayer) {
        const runCountdown = myTurn && GameStateUtility.IsGamePaused(gameState) === false;
        return (
            <div className='flex-row'>
                <span className='flex-grow'>
                    - <CountdownComponent timeLeft_ms={myPlayer.timeLeft_ms} run={runCountdown}></CountdownComponent> -
                </span>
                <button className='secondary' onClick={() => {
                    setPlayerAction({
                        playerId: myPlayer.id,
                        action: PlayerActionType.META,
                        pause: !myPlayer.paused
                    });
                }}>
                    { myPlayer.paused ? 'Play' : 'Pause' }
                </button>
            </div>
        );
    }

    return (<div></div>)
}

export default PlayerStateHeaderComponent;
