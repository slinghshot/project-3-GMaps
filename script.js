var map;
var rectangle;
var score = 0;
var topScore = -1;
var userName = "player";
var history = [];

function initMap() {
  const myLatlng = { lat: 34.24089744728458, lng: -118.52824179620252 };
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
    center: myLatlng,
    gestureHandling: "none",
    keyboardShortcuts: false,
    disableDefaultUI: true,
    mapTypeId: "satellite",
    styles,
  });
}

async function mainGame() {
  let count = 0;
  let questions = [
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
  for (let i = 0; i < questions.length; i++) {
    document.getElementById(
      "QA"
    ).innerHTML += `<p class="question">${questions[i].question}</p>`;
    let coord = await getCoord();
    let isCorrect = getAnswer(coord, questions[i]);

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

function getCoord() {
  return new Promise((resolve) => {
    google.maps.event.addListener(map, "dblclick", function (event) {
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
      resolve({ lat, lng });
    });
  });
}

function draw(ans) {
  let bounds = ans.bounds;
  let colorIndicator = ans.correct ? "#00FF00" : "#FF0000";
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

function getAnswer(coord, question) {
  if (
    coord.lat < question.bounds.north &&
    coord.lat > question.bounds.south &&
    coord.lng < question.bounds.east &&
    coord.lng > question.bounds.west
  ) {
    question.correct = true;
  }
  draw(question);
  return question.correct;
}

async function reinitialize() {
  initMap();
  document.getElementById("QA").textContent = "";
  await mainGame();
  displayButton();
}

function restart() {
  return new Promise((resolve) => {
    let RESETBUTTON = document.getElementById("restartButton");
    RESETBUTTON.style.display = "block";
    RESETBUTTON.addEventListener("click", resetit);
    function resetit() {
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
      resolve(true);
    }
  });
}

function setLeaderBoard() {
  document.getElementById("scores").innerHTML = "";

  history.sort((a, b) => b.score - a.score);

  for (let i = 0; i < history.length; i++) {
    document.getElementById("scores").innerHTML += `<p>${history[i].player}: ${
      history[i].score
    } - ${5 - history[i].score}</p>`;
  }
}

while (true) {
  initMap();
  document.getElementById("QA").textContent = "";
  await mainGame();
  await restart();
}
