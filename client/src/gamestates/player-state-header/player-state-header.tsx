import { GameStateUtility } from '../../common/models/game.model';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { Game } from '../../model/game';
import CountdownComponent from '../countdown/countdown';
import './player-state-header.scss';

function PlayerStateHeaderComponent({ game }: { game: Game} ) {

    const me = game.meInGame;
    if (me) {
        const runCountdown = me.myTurn && GameStateUtility.IsGamePaused(game.state) === false;
        return (
            <div className='flex-row'>
                <div className='my-level'>
                    <button className='secondary' onClick={() =>
                        me.emitAction({
                            action: PlayerActionType.META,
                            powerLevel: me.myPlayer.powerLevel - 1
                        }
                    )}>&nbsp;-&nbsp;</button>
                    <button className='secondary' onClick={() =>
                        me.emitAction({
                            action: PlayerActionType.META,
                            powerLevel: me.myPlayer.powerLevel + 1
                        }
                    )}>&nbsp;+&nbsp;</button>
                    <span>My level: {me.myPlayer.powerLevel}</span>
                </div>
                <span className='flex-grow timer'>
                    <CountdownComponent timeLeft_ms={me.myPlayer.timeLeft_ms} run={runCountdown}></CountdownComponent>s
                </span>
                <button className='secondary' onClick={() => {
                    me.emitAction({
                        action: PlayerActionType.META,
                        pause: !me.myPlayer.paused
                    });
                }}>
                    { me.myPlayer.paused ? 'Play' : 'Pause' }
                </button>
            </div>
        );
    }

    return (<div></div>)
}

export default PlayerStateHeaderComponent;
