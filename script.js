var map, rectangle;
var score = 0;
var topScore = -1;
var userName = "player";
var history = [];

/* 
  initMap() initalizes the map with no poi or road labels.
  sets map style to satellite 
*/
function initMap() {
  const LATLNG = { lat: 34.24058036903054, lng: -118.52809409593642 };
  let styles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16.9,
    center: LATLNG,
    gestureHandling: "none",
    keyboardShortcuts: false,
    disableDefaultUI: true,
    mapTypeId: "satellite",
    styles,
  });
}

/*
  mainGame() sets up the game,
  array object qa contains question, boolean that changes based on answer, and rect bounds.
  count increments by 1 if correct.
*/
async function mainGame() {
  let count = 0;
  let qa = [
    {
      question: "Where is Physical Plant Mgmt./Corp. Yard?",
      correct: false,
      bounds: {
        north: 34.24447391858064,
        south: 34.242873061808986,
        east: -118.5303958740213,
        west: -118.53169066556696,
      },
    },
    {
      question: "Where is the Jacaranda?",
      correct: false,
      bounds: {
        north: 34.242234586459084,
        south: 34.24102826943295,
        east: -118.52780002802461,
        west: -118.52950591295809,
      },
    },
    {
      question: "Where is the Library?",
      correct: false,
      bounds: {
        north: 34.24042515546377,
        south: 34.23960030142163,
        east: -118.52861837874111,
        west: -118.5301096869534,
      },
    },
    {
      question: "Where is the Sierra Hall?",
      correct: false,
      bounds: {
        north: 34.23915239342137,
        south: 34.23807917841805,
        east: -118.529857559306,
        west: -118.53150980005917,
      },
    },
    {
      question: "Where is the Redwood Hall?",
      correct: false,
      bounds: {
        north: 34.242416302077984,
        south: 34.24126330532438,
        east: -118.52574103572182,
        west: -118.52687829234414,
      },
    },
  ];
  for (let i = 0; i < qa.length; i++) {
    document.getElementById(
      "QA"
    ).innerHTML += `<p class="question">${qa[i].question}</p>`;
    let isCorrect = await getAnswer(await getCoord(), qa[i]);

    let output = isCorrect
      ? `<p class="correct">Your answer is correct!!</p>`
      : `<p class="wrong">Sorry wrong location.</p>`;
    document.getElementById("QA").innerHTML += output;
    if (isCorrect) {
      count++;
    }
  }
  score = count;
  document.getElementById(
    "QA"
  ).innerHTML += `<h1 class="result">${score} correct, ${
    5 - score
  } incorrect</h1>`;
}

/* 
  returns promise when map is double clicked, it returns array of object lat,lng.
*/
function getCoord() {
  return new Promise((resolve) => {
    google.maps.event.addListener(map, "dblclick", function (event) {
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
      console.log(lat, lng);
      resolve({ lat, lng });
    });
  });
}

/*
  draws the rectangle given the bounds and if answer was correct
  if ans correct stroke color is green color, if wrong its red.
*/
function drawRect(ans) {
  let bounds = ans.bounds;
  let colorIndicator = ans.correct ? "#00FF00" : "#fb1029";
  rectangle = new google.maps.Rectangle({
    strokeColor: colorIndicator,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: colorIndicator,
    fillOpacity: 0.35,
    map,
    bounds,
  });
}

/*
  getAnswer returns boolean
  checks if coordinates clicked on are within the answers bounds.
*/
function getAnswer(coord, question) {
  if (
    coord.lat < question.bounds.north &&
    coord.lat > question.bounds.south &&
    coord.lng < question.bounds.east &&
    coord.lng > question.bounds.west
  ) {
    question.correct = true;
  }
  drawRect(question);
  return question.correct;
}

/*
  restart() shows the restart button,
  when clicked it, calls arrow func 
    that checks if score is higher than topScore, if true ask name, set that to topscore and call setLeaderboard()
  push the high score obj into history array, to be sorted later by setLeaderBoard() func
*/
function restart() {
  return new Promise((resolve) => {
    let RESETBUTTON = document.getElementById("restartButton");
    RESETBUTTON.style.display = "block";
    RESETBUTTON.addEventListener("click", () => {
      RESETBUTTON.style.display = "none";
      if (score > topScore) {
        userName = prompt("Top Score: Your username:");
        if (userName === null || userName === "") {
          userName = "player";
        }
        topScore = score;

        history.push({ player: userName, score: topScore });
        setLeaderBoard();
      }
      resolve();
    });
  });
}

/*
  sets leaderboard high score {playerName}: {correct} - {wrong} 
*/
function setLeaderBoard() {
  document.getElementById("scores").innerHTML = "";

  history.sort((a, b) => b.score - a.score);

  for (let i = 0; i < history.length; i++) {
    document.getElementById("scores").innerHTML += `<p>${history[i].player}: ${
      history[i].score
    } - ${5 - history[i].score}</p>`;
  }
}

/*
  continuously loop through initalization 
    of map, 
    of questions
    of maingame
    of restart
  once restart is clicked everything loops over
*/
while (true) {
  initMap();
  document.getElementById("QA").textContent = "";
  await mainGame();
  await restart();
}
