import FightPostComponent from './fight-post/fight-post';
import FightComponent from './fight/fight';
import LobbyComponent from './lobby/Lobby';
import OpeningDoorComponent from './opening-door/opening-door';
import PlayerStateHeaderComponent from './player-state-header/player-state-header';
import './game-state.scss';
import { GameState, GameStateUtility, Player } from '../common/models/game.model';
import FinishedComponent from './finished/finished';
import { useGame } from '../utility/use-game';
import { Game } from '../model/game';


function GameStateComponent() {

    const [game, setMyPlayerId] = useGame();

    if (!game) {
        return <div>Waiting for game-state...</div>
    }

    function gameIsPausedBy(state: GameState): Array<Player> {
        return GameStateUtility.GetAllPlayersInGame(state).filter((p) => p.paused);
    }

    function commonWhenGameIsOn(game: Game, html: any): any {
        const isPaused = GameStateUtility.IsGamePaused(game.state) ? 'flex' : 'none';
        return (
            <div className={'full-screen flex-column ' + (game.meInGame?.myTurn ? 'my-turn' : '') }>
                <PlayerStateHeaderComponent game={game}></PlayerStateHeaderComponent>
                <div className='common-wrapper flex-grow'>
                    <div className='game-state'>
                        {html}
                    </div>
                    <div className='paused center-content' style={{ display: isPaused }}>
                        <div>
                            <span>Game is paused by:</span>
                            <br></br>
                            <span>{gameIsPausedBy(game.state).map((p) => p.name).join(', ')}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const component = (() => {
        switch (game.state.state) {
            case 'LOBBY': return <LobbyComponent game={game} setMyPlayerId={setMyPlayerId}/>;
            case 'OPENING_DOOR': return commonWhenGameIsOn(game, <OpeningDoorComponent game={game as any}/>);
            case 'FIGHTNING': return commonWhenGameIsOn(game, <FightComponent game={game as any}/>);
            case 'AFTER_FIGHT': return commonWhenGameIsOn(game, <FightPostComponent/>);
            case 'FINISHED': return <FinishedComponent game={game as any}/>;
        }
    })();

    return (
        <div>
            {component}
        </div>
    );
}

export default GameStateComponent;
