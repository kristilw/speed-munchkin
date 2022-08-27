import { useGameState } from '../utility/use-game-state';
import FightPostComponent from './fight-post/fight-post';
import FightComponent from './fight/fight';
import LobbyComponent from './lobby/Lobby';
import OpeningDoorComponent from './opening-door/opening-door';
import PlayerStateHeaderComponent from './player-state-header/player-state-header';
import './game-state.scss';
import { GameState, GameStateUtility, Player } from '../common/models/game.model';
import FinishedComponent from './finished/finished';


function GameStateComponent() {

    const [gameState] = useGameState();

    if (!gameState) {
        return <div>No game state</div>
    }

    function gameIsPausedBy(state: GameState): Array<Player> {
        return GameStateUtility.GetAllPlayersInGame(state).filter((p) => p.paused);
    }

    function commonWhenGameIsOn(html: any, state: GameState): any {
        const isPaused = GameStateUtility.IsGamePaused(state) ? 'flex' : 'none';
        return (
            <div className='full-screen flex-column'>
                <PlayerStateHeaderComponent></PlayerStateHeaderComponent>
                <div className='common-wrapper flex-grow'>
                    <div className='game-state'>
                        {html}
                    </div>
                    <div className='paused center-content' style={{ display: isPaused }}>
                        <div>
                            <span>Game is paused by:</span>
                            <br></br>
                            <span>{gameIsPausedBy(state).map((p) => p.name).join(', ')}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const component = (() => {
        switch (gameState?.state) {
            case 'LOBBY': return <LobbyComponent/>;
            case 'OPENING_DOOR': return commonWhenGameIsOn(<OpeningDoorComponent/>, gameState);
            case 'FIGHTNING': return commonWhenGameIsOn(<FightComponent/>, gameState);
            case 'AFTER_FIGHT': return commonWhenGameIsOn(<FightPostComponent/>, gameState);
            case 'FINISHED': return <FinishedComponent/>;
        }
    })();

    return (
        <div>
            {component}
        </div>
    );
}

export default GameStateComponent;
