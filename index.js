const data = [
  {
    StartTime: "05:00",
    EndTime: "08:00",
    itemName: "Sample Item",
    itemLoc: "Sample Location",
  },
  // {
  //   StartTime: "03:00",
  //   EndTime: "05:00",
  //   itemName: "Sample Item",
  //   itemLoc: "Sample Location",
  // },
  {
    StartTime: "06:00",
    EndTime: "07:00",
    itemName: "Sample Item",
    itemLoc: "Sample Location",
  },
  {
    StartTime: "07:00",
    EndTime: "08:00",
    itemName: "Sample Item",
    itemLoc: "Sample Location",
  },
];

let divvv = `<div class="populate-target-parent">
          <div class="section2-right_left"></div>

          <div class="populate-target">
            <p class="time">All Day-</p>
            <p class="sample-item">Sample Item</p>
            <p class="sample-loc">Sample Location</p>
          </div>
        </div>`;
let sec3Right = document.querySelector(".section3-right");
let target = document.querySelectorAll(".populate");
let halfHourTarget = document.querySelectorAll(".half-hour-populate");
let height = document.querySelector(".populate-target");
let hours = document.querySelectorAll(".section3-right-1hour");
let halfHours = document.querySelectorAll(".half-hour-2");

let StarttimeCheckArr = data.map((e) => e.StartTime);
let EndtimeCheckArr = data.map((e) => e.EndTime);

function intToStrTime(num) {
  num > 12.5 ? (num = num - 12) : (num = num);
  if (num <= 9.5)
    return num % 1 == 0 ? `0${num}:00` : `0${num.toString()[0]}:30`;
  if (num > 9.5)
    return num % 1 == 0
      ? `${num}:00`
      : `${num.toString()[0] + num.toString()[1]}:30`;
}
function StrTimetoInt(time) {
  return time[3] == "3" ? (time = parseInt(time) + 0.5) : parseInt(time);
}
function makeTimes(startTime, endTime) {
  let times = [];
  StrTimetoInt(startTime) < 8.8 //actually 9
    ? (startTime = StrTimetoInt(startTime) + 12)
    : (startTime = StrTimetoInt(startTime));
  StrTimetoInt(endTime) < 8.8 //actually 9
    ? (endTime = StrTimetoInt(endTime) + 12)
    : (endTime = StrTimetoInt(endTime));
  //making to collect right collisons
  startTime = startTime + 0.5;
  while (startTime <= endTime) {
    times.push(intToStrTime(startTime));
    startTime = startTime + 0.5;
  }
  return times;
}

let eventCollisonsData = [];
let eventCollisonsDataCounter = 0;
let allEventTimes = [];
let overlappedCount = 0;
// data
//   .filter((e) => e.StartTime != startTime && e.EndTime != endTime)
data.map((e) => {
  allEventTimes.push(makeTimes(e.StartTime, e.EndTime));
});

/////Making all collisions data
for (let i = 0; i < data.length; i++) {
  let currMakeTime = makeTimes(data[i].StartTime, data[i].EndTime);
  for (j = 0; j < data.length; j++) {
    if (j == i) continue;
    else {
      allEventTimes[j].map((e) => {
        if (currMakeTime.includes(e)) {
          //solution while eventCollisonData[i] is undefined
          eventCollisonsData[i] == undefined
            ? (eventCollisonsData[i] = "")
            : (eventCollisonsData[i] = eventCollisonsData[i]);

          eventCollisonsData[i].includes(j)
            ? eventCollisonsData[i]
            : (eventCollisonsData[i] += j);
        }
      });
    }
  }
}

function DisplayEvent(startTime, endTime) {
  let first;
  let second;
  let populateTarget;
  let diff;
  let firstIndex;
  let SecondIndex;
  let hourStartBoolean = false;
  let populateTargetParent;

  for (let i = 0; i < hours.length; i++) {
    if (hours[i].textContent.substring(13, 18) == startTime) {
      first = hours[i].offsetTop;
      target[i].innerHTML = divvv;
      target[i].style.display = "flex";
      populateTarget = target[i].childNodes[0].childNodes[3];

      let CurrnumOfEventCollisons =
        eventCollisonsData[eventCollisonsDataCounter] != null
          ? eventCollisonsData[eventCollisonsDataCounter].length
          : 0;

      function findMaxEventLinkedandWidth() {
        if (eventCollisonsData[eventCollisonsDataCounter] != null) {
          let colllisions = eventCollisonsData[eventCollisonsDataCounter];
          let max = CurrnumOfEventCollisons;
          for (let i = 0; i < colllisions.length; i++) {
            if (eventCollisonsData[colllisions[i]].length > max)
              max = eventCollisonsData[colllisions[i]].length;
          }
          return max;
        } else return 0;
      }

      let offsetRight = window.innerWidth - target[i].offsetLeft * 1.8; //or acutally 2 ;
      // target[i].childNodes.forEach((e) => (e.style.flex = "1 1 auto"));

      // target[i].childNodes.forEach(
      //   (e) => (e.style.width = `${offsetRight / (findMaxEventLinkedandWidth() + 1)}px`)
      // );
      target[i].style.width = `${
        offsetRight / (findMaxEventLinkedandWidth() + 1)
      }px`; //the above sol is absolutely right
      hourStartBoolean = true;

      if (startTime == "07:00") {
      }
      /////////Positiong/////////////

      let max = findMaxEventLinkedandWidth();
      let followingCollisions = eventCollisonsData[eventCollisonsDataCounter];
      console.log(followingCollisions);
      //12
      //02
      //01
      // let lefttt = parseInt(target[i].style.width);
      let lefttt = 140;
      let Width = parseInt(target[i].style.width);
      followingCollisions == null
        ? (followingCollisions = 0)
        : followingCollisions;
      for (let i = 0; i < followingCollisions.length; i++) {
        let index = eventCollisonsDataCounter;
        if (followingCollisions[i] != null) {
          //console.log(followingCollisions[i]);
          if (index < followingCollisions[i]) {
            lefttt = lefttt + Width * i;
            break;
          }
          if (
            i == followingCollisions.length - 1 &&
            index >= followingCollisions[i]
          )
            lefttt = lefttt + Width * followingCollisions.length;
        }
      }
      console.log(max);
      // console.log(lefttt);
      // At last setting width
      target[i].style.left = `${lefttt}px`;

      /////incrementing Counter Variable

      eventCollisonsDataCounter++;
    }
    if (hours[i].textContent.substring(13, 18) == endTime) {
      second = hours[i].offsetTop;
      //target[i].innerHTML = divvv;
    }

    if (halfHours[i].textContent == startTime) {
      //first = halfHours[i].offsetTop;
      halfHourTarget[i].innerHTML = divvv;
      halfHourTarget[i].style.top = "45px";
      //setting popluate length respective to hours[i]
      first = hours[i].offsetTop;
      populateTarget = halfHourTarget[i].childNodes[0].childNodes[3];
    }
    if (halfHours[i].textContent == endTime) {
      second = hours[i].offsetTop;
    }
    if (hourStartBoolean && halfHours[i].textContent == endTime) {
      second = hours[i].offsetTop;
      second =
        second + (hours[i].offsetTop - hours[i > 0 ? i - 1 : i].offsetTop) / 2;
    }
    if (
      halfHours[i].textContent != endTime &&
      hours[i].textContent.substring(13, 18) == endTime &&
      hourStartBoolean == false
    ) {
      second = halfHours[i].offsetTop;
      // setting popluate length respective to hours[i]
      second = hours[i].offsetTop;

      diff = (hours[i].offsetTop - hours[i > 0 ? i - 1 : i].offsetTop) / 2;
      second = second - diff;
    }
    //if end time is 9 then stretching to 9
    if (endTime == "09:00") {
      second =
        hours[hours.length - 1].offsetTop +
        (hours[hours.length - 1].offsetTop -
          hours[hours.length - 2].offsetTop) /
          2;
    }
  }

  let eventHeight = second - first;
  populateTarget.style.height = `${eventHeight - 3}px`;
}

data.map((e) => {
  DisplayEvent(e.StartTime, e.EndTime);
});
