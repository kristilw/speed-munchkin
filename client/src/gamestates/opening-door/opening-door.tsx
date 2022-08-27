import { useGameState } from '../../utility/use-game-state';
import { useMyGamePlayer } from '../../utility/use-my-game-player';
import { useCurrentPlayer } from '../../utility/use-current-player';
import './opening-door.scss';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { GameStateUtility } from '../../common/models/game.model';
import CountdownComponent from '../countdown/countdown';

function OpeningDoorComponent() {
  const [gameState, setPlayerAction] = useGameState();
  const [myPlayer, myTurn] = useMyGamePlayer();
  const [currentPlayer] = useCurrentPlayer();

  if (gameState && myPlayer && currentPlayer) {
    if (myTurn) {
      return (
        <div className='center-content'>
          <div className='content'>
            <span>It is your turn</span>
            <h1>{myPlayer.name}</h1>
            <p>The timer is running!</p>
            <button onClick={() => setPlayerAction({
              playerId: myPlayer.id,
              action: PlayerActionType.END_TURN
            })}>End turn</button>
          </div>
        </div>
      )
    }

    const runCountdown = GameStateUtility.IsGamePaused(gameState) === false;
    return (
      <div className='center-content'>
        <div className='content'>
          <span>Current player:</span>
          <h1>{currentPlayer.name}</h1>
          <p>Time left: <CountdownComponent timeLeft_ms={currentPlayer.timeLeft_ms} run={runCountdown}></CountdownComponent></p>
        </div>
      </div>
    )
  }

  return (<div></div>);
}

export default OpeningDoorComponent;
