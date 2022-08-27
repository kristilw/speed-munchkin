import { GameStateUtility } from '../../common/models/game.model';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { Game } from '../../model/game';
import CountdownComponent from '../countdown/countdown';
import './fight.scss';

function FightComponent({ game }: { game: Game }) {
  const me = game.meInGame;

  if (me && me.myTurn) {
    return (
      <div className='center-content'>
        <div className='content'>
          <span>You are fightning a monster</span>
          <h1>{me.myPlayer.name}</h1>
          <p>The timer is running!</p>

          <button onClick={() => game.meInGame?.emitAction({
            action: PlayerActionType.END_TURN
          })}>End turn</button>
        </div>
      </div>
    );  
  }

  const runCountdown = GameStateUtility.IsGamePaused(game.state) === false;
  return (
    <div className='center-content'>
        <div className='content'>
          <h1>{game.currentPlayer.name}</h1>
          <h2>Is fighting a monster</h2>
          <p>Time left: <CountdownComponent timeLeft_ms={game.currentPlayer.timeLeft_ms} run={runCountdown}></CountdownComponent></p>
        </div>
      </div>
  );
}

export default FightComponent;
