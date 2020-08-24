"use strict";

import Popup from "./popup.js";

import * as sound from "./sound.js";
import { GameBuilder, Reason } from "./game.js";

const gameFinishBanner = new Popup();
const game = new GameBuilder()
  .gameDurationSec(5)
  .carrotcount(3)
  .bugCount(3)
  .build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = "REPLAY?";
      sound.playAlert();
      break;
    case Reason.win:
      message = "WIN!";
      sound.playWin();
      break;
    case Reason.lose:
      message = "LOSE";
      sound.playBug();
      break;
    default:
      throw new Error("not valid");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
