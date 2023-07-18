interface Player {
  name: string;
  frames: object,
  frameTotals: object,
  gameTotal: number
}

export class App {
  players: Player[];

  constructor() {
    this.players = [{
      name: 'Player 1',
      frames: {},
      frameTotals: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null},
      gameTotal: null
    }];
  }

  updateRoll(player, frame, roll, score) {
    player.frames = {...player.frames, [frame]: {...player.frames[frame], [roll]: score}}
    this.updateScore(player)
  }

  updateScore(player) {
    let finalScore;
    for (let i = 1; i <= 10; i++) {
      const prevTotal = i === 1 ? 0 : player.frameTotals[i - 1];
      if (i !== 10) {
        if(!player.frames[i] || !player.frames[i]['1'] || (!player.frames[i]['2'] && Number(player.frames[i]['1']) !== 10)) return;
        if (Number(player.frames[i]['1']) === 10) {
          if (!player.frames[i + 1] || !player.frames[i + 1]['1'] || !player.frames[i + 1]['2']) return
          player.frameTotals[i] = prevTotal + 10 + Number(player.frames[i + 1]['1']) + Number(player.frames[i + 1]['2']);
        } else if (Number(player.frames[i]['1']) < 10 && (Number(player.frames[i]['1']) + Number(player.frames[i]['2'])) === 10) {
          if (!player.frames[i + 1] || !player.frames[i + 1]['1']) return
          player.frameTotals[i] = prevTotal + 10 + Number(player.frames[i + 1]['1']);
        } else {
          player.frameTotals[i] = prevTotal + Number(player.frames[i]['1']) + Number(player.frames[i]['2']);
        }
      } else {
        if (!player.frames['10']['2'] || Number(player.frames['10']['1']) + Number(player.frames['10']['2']) === 10 && !player.frames['10']['3']) return
        if (Number(player.frames['10']['1']) + Number(player.frames['10']['2']) >= 10) {
          if (!player.frames['10']['3']) return;
          finalScore = prevTotal + Number(player.frames['10']['1']) + Number(player.frames['10']['2']) + Number(player.frames['10']['3']);
        } else {
          finalScore = prevTotal + Number(player.frames['10']['1']) + Number(player.frames['10']['2']);
        }
        player.frameTotals['10'] = finalScore
        player.gameTotal = finalScore
      }
    }
  }

  addPlayer() {
    this.players.push({
      name: `Player ${this.players.length + 1}`,
      frames: {},
      frameTotals: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null},
      gameTotal: null
    })
  }

  removePlayer(player: Player) {
    const index = this.players.indexOf(player);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }

}
