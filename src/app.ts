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

  updateScore(player) {
    console.log(player)
    let finalScore;
    for (let i = 1; i <= 10; i++) {
      const prevTotal = i === 1 ? 0 : player.frameTotals[i - 1];
      // Handles logic for frames 1-9
      if (i !== 10) {
        // Ends loop for any frames that haven't been filled in completely yet
        if(!player.frames[i] || !player.frames[i]['1'] || (!player.frames[i]['2'] && Number(player.frames[i]['1']) !== 10)) return;
        // Handles strikes
        if (Number(player.frames[i]['1']) === 10) {
          // Holds off on scoring if subsequent frame isn't sufficiently filled in
          if (!player.frames[i + 1] || !player.frames[i + 1]['1'] || (Number(player.frames[i + 1]['1']) < 10 && !player.frames[i + 1]['2'])) return
          if ((player.frames[i + 1] && Number(player.frames[i+1]['1']) < 10) || (player.frames[i + 1] && player.frames[i + 1]['2'] && i === 9)) {
            // Handles scoring if subsequent frame is a non-strike or if the subsequent frame is frame 10
            player.frameTotals[i] = prevTotal + 10 + Number(player.frames[i + 1]['1']) + Number(player.frames[i + 1]['2']);
          } else {
            // Holds off on scoring in the event of two consecutive strikes until the third frame is begun
            if (!player.frames[i + 2] || !player.frames[i + 2]['1']) return
            // Handles scoring for two consecutive strikes
            player.frameTotals[i] = prevTotal + 10 + Number(player.frames[i + 1]['1']) + Number(player.frames[i + 2]['1']);
          }
          // Handles spares
        } else if (Number(player.frames[i]['1']) < 10 && (Number(player.frames[i]['1']) + Number(player.frames[i]['2'])) === 10) {
          // Awaits next frame data
          if (!player.frames[i + 1] || !player.frames[i + 1]['1']) return
          // Handles scoring for spares
          player.frameTotals[i] = prevTotal + 10 + Number(player.frames[i + 1]['1']);
        } else {
          // Handles scoring for non-strike, non-spares
          player.frameTotals[i] = prevTotal + Number(player.frames[i]['1']) + Number(player.frames[i]['2']);
        }
        // Handles logic for the 10th frame
      } else {
        // Awaits sufficent data to score frame
        if (!player.frames['10'] || !player.frames['10']['2'] || Number(player.frames['10']['1']) + Number(player.frames['10']['2']) === 10 && !player.frames['10']['3']) return
        // Handles strikes and spares
        if (Number(player.frames['10']['1']) + Number(player.frames['10']['2']) >= 10) {
          // Awaits third roll
          if (!player.frames['10']['3']) return;
          // Stores final score for strikes and spares in frame 10
          finalScore = prevTotal + Number(player.frames['10']['1']) + Number(player.frames['10']['2']) + Number(player.frames['10']['3']);
        } else {
          // Stores final score for non-strikes, non-spares in frame 10
          finalScore = prevTotal + Number(player.frames['10']['1']) + Number(player.frames['10']['2']);
        }
        // Sets final score for frame and game total
        player.frameTotals['10'] = finalScore
        player.gameTotal = finalScore
      }
    }
  }


}
