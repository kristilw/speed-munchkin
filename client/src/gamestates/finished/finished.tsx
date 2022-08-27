import { restartGame } from '../../utility/restart-game';
import { useGameState } from '../../utility/use-game-state';
import './finished.scss';

function FinishedComponent() {
    const [gameState] = useGameState();

    if (gameState && gameState.state === 'FINISHED') {
        return (
            <div className='full-screen center-content'>
                <div>
                    <h1 className='center-text'> 
                        {gameState.players[gameState.winner].name}
                    </h1>
                    <h2>won the game!</h2>

                    <button onClick={restartGame}>
                        Create new lobby
                    </button>
                </div>
            </div>
        )
    }

    return (<div></div>);
}

export default FinishedComponent;
