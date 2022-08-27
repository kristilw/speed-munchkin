import { useRef, useState } from 'react';
import { Player } from '../../common/models/game.model';
import { PlayerActionType } from '../../common/models/player-actions.model';
import { useGameState } from '../../utility/use-game-state';
import { useMyPlayerId } from '../../utility/use-my-player-id';
import './Lobby.scss';

function LobbyComponent() {
  const [gameState, setPlayerAction] = useGameState();
  const [tmpSelectPlayer, setTmpSelectPlayer] = useState<Player['id'] | undefined>(undefined)
  const [myPlayerId, setMyPlayerId] = useMyPlayerId();
  const inputRef = useRef(null);

  const header = (content: any) => {
    return (
      <div className='full-screen flex-column'>
        <h1>Speed munchkin</h1>
        {content}
      </div>
    )
  }

  if (gameState) {
    const players = Object.values(gameState.players);
    const relevantPlayers = players.filter((p) => p.name);

    if (myPlayerId && gameState.id === myPlayerId?.gameId) {
      return header(
        <div className='flex-column'>
          <h2>My name: <span>{gameState.players[myPlayerId.playerId].name}</span></h2>
          <h4>Players:</h4>
          {
            relevantPlayers.map((p) =>
              <div key={p.id}>
                <span>{p.id + 1}. - {p.name}</span>
              </div>
            )
          }
          <div style={{marginTop: '3em'}}>
            <button disabled={relevantPlayers.length <= 1} onClick={() => setPlayerAction({
              action: PlayerActionType.START_GAME,
              playerId: myPlayerId.playerId
            })}>Ready to play</button>
            <button style={{ marginLeft: '0.5em' }} onClick={() => {
              console.log('reset user id');
              setPlayerAction({
                playerId: myPlayerId.playerId,
                action: PlayerActionType.META,
                name: null
              });
              setMyPlayerId({
                playerId: 0, // player id does not matter when gameId is set to empty string
                gameId: '',
                name: myPlayerId.name
              });
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
              <button className='secondary' onClick={() => setTmpSelectPlayer(undefined)}>Tilbake</button>
            </div>
          </div>
          <span>Your name:</span>
          <input type='text' defaultValue={myPlayerId?.name ?? ''} ref={inputRef}/>
          <div>
            <button onClick={() => {
              setMyPlayerId({
                playerId: tmpSelectPlayer,
                gameId: gameState.id,
                name: (inputRef.current as any).value
              });
              setPlayerAction({
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

  return header(<h2>Waiting for game state</h2>);
}

export default LobbyComponent;
