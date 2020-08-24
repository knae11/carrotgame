"use strict";

import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  cancel: "cancel",
});
//Builder pattern
export class GameBuilder {
  gameDurationSec(duration) {
    this.gameDurationSec = duration;
    return this;
  }

  carrotcount(num) {
    this.carrotcount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDurationSec, //
      this.carrotcount,
      this.bugCount
    );
  }
}
class Game {
  constructor(gameDurationSec, carrotCount, bugCount) {
    this.gameDurationSec = gameDurationSec;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector(".game_button");
    this.gameTimer = document.querySelector(".game_timer");
    this.gameScore = document.querySelector(".game_score");

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListner(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;

    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.pause(Reason.cancel);
      } else {
        this.start();
      }
    });
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.pause(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.pause(Reason.lose);
    }
  };

  start() {
    this.started = true;
    this.init();
    this.showStopButton();
    this.showTimerAndScore();
    this.startTimer();
    sound.playBackground();
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  pause(reason) {
    this.started = false;
    this.stopTimer();
    this.hideButton();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  init() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }

  showStopButton() {
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fap-play");

    this.gameBtn.style.visibility = "visible";
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }

  startTimer() {
    let remainingTimeSec = this.gameDurationSec;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.pause(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }
  hideButton() {
    this.gameBtn.style.visibility = "hidden";
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes} : ${seconds}`;
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
