import { GameStateFighting, GameStateUtility } from '../../common/models/game.model';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { Game } from '../../model/game';
import CountdownComponent from '../countdown/countdown';
import './fight.scss';

function FightComponent({ game }: { game: Game<GameStateFighting> }) {
  const me = game.meInGame;

  const fightScore = game.currentPlayer.powerLevel
    - game.state.monsterPowerLevel
    + game.state.actionsOfOtherPlayers.reduce((a, n) => a + n.powerLevel, 0);

  const nameOfPlayer = me?.myTurn ? 'You are' : game.currentPlayer.name + ' is'

  const fightScoreDom = fightScore > 0 ? (
    <div>
      {nameOfPlayer} currently <span className='winning'>winning</span> by {fightScore} point{fightScore === 1 ? '' : 's'}!
    </div>
  ) : (
    fightScore < 0 ? (
      <div>
        {nameOfPlayer} is currently <span className='loosing'>loosing</span> by {Math.abs(fightScore)} point{fightScore === -1 ? '' : 's'}!
      </div>
    ) : (
      <div>
        {nameOfPlayer} is currently <span className='even'>even</span> with the monster.
      </div>
    )
  )

  function commonDom(extraDom: any) {
    return (
      <div className='center-content'>
        <div className='content'>
          <h1>{game.currentPlayer.name}</h1>
          <h2>Is fighting a monster</h2>
          <span>{fightScoreDom}</span>
          {extraDom}
        </div>
      </div>
    )
  }

  if (me && me.myTurn) {
    return commonDom(
      <div>
        <p>The timer is running!</p>

        <button onClick={() => game.meInGame?.emitAction({
          action: PlayerActionType.END_TURN
        })}>End turn</button>
      </div>
    )
  }

  const runCountdown = GameStateUtility.IsGamePaused(game.state) === false;
  return commonDom(
    <p>Time left: <CountdownComponent timeLeft_ms={game.currentPlayer.timeLeft_ms} run={runCountdown}></CountdownComponent></p>
  );
}

export default FightComponent;
