import './opening-door.scss';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { GameStateOpeningDoor, GameStateUtility } from '../../common/models/game.model';
import CountdownComponent from '../countdown/countdown';
import { Game } from '../../model/game';

function OpeningDoorComponent({ game }: { game: Game<GameStateOpeningDoor> }) {
  const meInGame = game.meInGame;
  if (meInGame && meInGame.myTurn) {
    return (
      <div className='center-content'>
        <div className='content'>
          <span>It is your turn</span>
          <h1>{meInGame.myPlayer.name}</h1>
          <p>The timer is running!</p>

          <div>
            <button onClick={() => game.meInGame?.emitAction({
              action: PlayerActionType.START_FIGHT,
              monsterLevel: 0 // user should set this value
            })}>
              Fight!
            </button>

            <button onClick={() => game.meInGame?.emitAction({
              action: PlayerActionType.END_TURN
            })}>
              End turn
            </button>
          </div>
        </div>
      </div>
    )
  }

  const runCountdown = GameStateUtility.IsGamePaused(game.state) === false;
  return (
    <div className='center-content'>
      <div className='content'>
        <span>Current player:</span>
        <h1>{game.currentPlayer.name}</h1>
        <p>Time left: <CountdownComponent timeLeft_ms={game.currentPlayer.timeLeft_ms} run={runCountdown}></CountdownComponent></p>
      </div>
    </div>
  )
}

export default OpeningDoorComponent;
