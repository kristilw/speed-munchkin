import { useRef, useState } from 'react';
import { Player } from '../../common/models/game.model';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { Game } from '../../model/game';
import { emitPlayerAction } from '../../utility/use-game-state';
import { PlayerGameId } from '../../utility/use-my-player-id';
import { useMyStoredName } from '../../utility/use-my-stored-name';
import './Lobby.scss';

function LobbyComponent({ game, setMyPlayerId }: { game: Game, setMyPlayerId: (id: PlayerGameId | undefined) => void}) {
  const [tmpSelectPlayer, setTmpSelectPlayer] = useState<Player['id'] | undefined>(undefined)
  const [myStoredName, setMyStoredName] = useMyStoredName();
  const inputRef = useRef(null);

  const header = (content: any) => {
    return (
      <div className='full-screen flex-column'>
        <h1>Speed munchkin</h1>
        {content}
      </div>
    )
  }

  const players = Object.values(game.state.players);
  const relevantPlayers = players.filter((p) => p.name);

  if (game.meInGame) {
    return header(
      <div className='flex-column'>
        <h2>My name: <span>{game.meInGame.myPlayer.name}</span></h2>
        <h4>Players:</h4>
        {
          relevantPlayers.map((p) =>
            <div key={p.id}>
              <span>{p.id + 1}. - {p.name}</span>
            </div>
          )
        }
        <div style={{marginTop: '3em'}}>
          <button disabled={relevantPlayers.length <= 1} onClick={() => game.meInGame?.emitAction({
            action: PlayerActionType.START_GAME
          })}>Ready to play</button>
          <button style={{ marginLeft: '0.5em' }} onClick={() => {
            console.log('reset user id');
            game.meInGame?.emitAction({
              action: PlayerActionType.META,
              name: null
            });
            setMyPlayerId(undefined);
          }}>Back</button>
        </div>
      </div>
    );
  }

  if (tmpSelectPlayer !== undefined) {
    return header(
      <div className='flex-column flex-grow'>
        <div className='flex-row'>
          <h2 className='flex-grow'>Player {tmpSelectPlayer + 1}</h2>
          <div>
            <button className='secondary' onClick={() => setTmpSelectPlayer(undefined)}>Back</button>
          </div>
        </div>
        <span>Your name:</span>
        <input type='text' defaultValue={myStoredName ?? ''} ref={inputRef}/>
        <div>
          <button onClick={() => {
            setMyPlayerId({
              playerId: tmpSelectPlayer,
              gameId: game.state.id
            });
            setMyStoredName((inputRef.current as any).value);
            emitPlayerAction({
              playerId: tmpSelectPlayer,
              action: PlayerActionType.META,
              name: (inputRef.current as any).value
            });
          }}>Joing game</button>
        </div>
      </div>
    );
  }


  return header(
    <div className='flex-column flex-grow'>
      <h2>Select a player</h2>
      <div className='players-wrapper flex-grow'>
        {
          players.map((v) =>
            <button disabled={!!v.name} className="player-selection center-content" onClick={() => setTmpSelectPlayer(v.id)} key={v.id}>
              { v.name ?? 'Player ' + (v.id + 1) }
            </button>
          )
        }
      </div>
    </div>
  );
}

export default LobbyComponent;
