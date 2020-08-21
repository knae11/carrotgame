const btn = document.querySelector(".btn");
const btnPlay = document.querySelector(".btn_play");
const btnStop = document.querySelector(".btn_stop");
const btnReplay = document.querySelector(".replay_btn");
const modals = document.querySelector(".modals");
const timer = document.querySelector(".timer_counting");
const left = document.querySelector(".left_carrot");
const images = document.querySelector(".gameimage");
const carrot = document.querySelectorAll(".gameimage_carrot");
const bug = document.querySelector(".gameimage_bug");
const replay = document.querySelector(".replay_replay");
const won = document.querySelector(".replay_won");
const lost = document.querySelector(".replay_lost");
const audioalert = new Audio("sound/alert.wav");
const audiobg = new Audio("sound/bg.mp3");
const audiocarrot = new Audio("sound/carrot_pull.mp3");
const audiobug = new Audio("sound/bug_pull.mp3");
const audiowin = new Audio("sound/game_win.mp3");
// countdown
btnPlay.addEventListener("click", () => {
  audiobg.play();
  switchPlayStop();
  gameStart();
});

function switchPlayStop() {
  btnPlay.classList.add("hidden");
  btnStop.classList.remove("hidden");
  timecount();
}
let ispaused = false;

function timecount() {
  let time = 5;
  const timeId = setInterval(countdown, 1000);
  function countdown() {
    if (!ispaused && time >= 1) {
      time = time - 1;
      timer.innerHTML = `${time}s`;
      btnStop.addEventListener("click", () => {
        ispaused = true;
        displayreplayModal();
      });
    } else if (time == 0) {
      clearTimeout(timeId);
      displaylostModal();
    }
  }
}

//random display and bug -> modal lost
class Images {
  constructor(name, src, classname, datatype, id, style) {
    this.name = name;
    this.src = src;
    this.classname = classname;
    this.datatype = datatype;
    this.id = id;
    this.style = style;
  }
}

const carrots = [
  new Images("bug", "img/bug.png", "gameimage_bug", "b"),
  new Images("bug", "img/bug.png", "gameimage_bug", "b"),
  new Images("bug", "img/bug.png", "gameimage_bug", "b"),
  new Images("carrot", "img/carrot.png", "gameimage_carrot", "c", "1"),
  new Images("carrot", "img/carrot.png", "gameimage_carrot", "c", "2"),
  new Images("carrot", "img/carrot.png", "gameimage_carrot", "c", "3"),
];

function gameStart() {
  function createElements(item) {
    const x = Math.floor(Math.random() * 1213);
    const y = Math.floor(Math.random() * 364);
    return `
  <img
  src="${item.src}"
  class="${item.classname}"
  data-type="${item.datatype}"
  id="${item.id}"
  style="position:absolute;transform : translate(${x}px, ${y}px)"
/>`;
  }

  images.innerHTML = carrots.map((item) => createElements(item)).join("");
}

images.addEventListener("click", winlose);
function winlose(event, item) {
  const dlt = event.target.className;
  const dltId = event.target.id;
  if (dlt == "gameimage_carrot") {
    const deleteitem = document.getElementById(`${dltId}`);
    deleteitem.remove();
    audiocarrot.play();
    carrots.splice(dltId, 1);
    let ea = carrots.length - 3;
    left.innerText = `${ea}ea`;
    if (ea === 0) {
      displaywonModal();
    }
    return;
  } else if (dlt == "gameimage_bug") {
    audiobug.play();
    displaylostModal();
  }
}

//modals
function displaylostModal() {
  modals.classList.remove("hidden");
  replay.classList.add("hidden");
  lost.classList.remove("hidden");
  audiobg.pause();
  ispaused = true;
  audioalert.play();
  btnReplay.addEventListener("click", () => {
    modals.classList.add("hidden");
    window.location.reload(true);
  });
}
function displaywonModal() {
  modals.classList.remove("hidden");
  replay.classList.add("hidden");
  won.classList.remove("hidden");
  ispaused = true;
  audiobg.pause();
  audiowin.play();
  btnReplay.addEventListener("click", () => {
    modals.classList.add("hidden");
    window.location.reload(true);
  });
}

function displayreplayModal() {
  modals.classList.remove("hidden");
  audiobg.pause();
  audioalert.play();
  btnReplay.addEventListener("click", () => {
    modals.classList.add("hidden");
    ispaused = false;
  });
}
