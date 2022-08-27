import { GameStateFinished } from '../../common/models/game.model';
import { Game } from '../../model/game';
import { restartGame } from '../../utility/restart-game';
import './finished.scss';

function FinishedComponent({ game }: { game: Game<GameStateFinished>} ) {
    return (
        <div className='full-screen center-content'>
            <div>
                <h1 className='center-text'> 
                    {game.state.players[game.state.winner].name}
                </h1>
                <h2>won the game!</h2>

                <button onClick={restartGame}>
                    Create new lobby
                </button>
            </div>
        </div>
    )
}

export default FinishedComponent;
