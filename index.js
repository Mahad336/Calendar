import { data, fullDayEvent } from "./data.js";
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
  for (let j = 0; j < data.length; j++) {
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

let targetAllday = document.querySelector(".allDay");

function fullDayEventt(name, loc) {
  targetAllday.innerHTML =
    targetAllday.innerHTML +
    `<div class="section2">
        <div class="section2-right">
          <div class="section2-right_left"></div>

          <div class="section2-right_right">
            <p class="time">All Day-</p>
            <p class="sample-item">${name}</p>
            <p class="sample-loc">${loc}</p>
          </div>
        </div>
      </div>`;
}

fullDayEvent.forEach((e) => fullDayEventt(e.itemName, e.itemLoc));
let map = new Map();

function DisplayEvent(startTime, endTime, namee, locc) {
  let first;
  let second;
  let populateTarget;
  let diff;
  let firstIndex;
  let SecondIndex;
  let hourStartBoolean = false;
  let populateTargetParent;

  if (endTime == "09:00") endTime = "08:30";

  for (let i = 0; i < hours.length; i++) {
    if (hours[i].textContent.substring(13, 18) == startTime) {
      if (Array.from(map.values()).includes(startTime)) {
        let eventNum =
          [...map].find(([key, value]) => startTime === value)[0] + 2;
        first = hours[i].offsetTop;
        let tempdiv = [];
        tempdiv[0] = target[eventNum].innerHTML;
        tempdiv[1] = divvv;
        target[eventNum].innerHTML = tempdiv;
        target[eventNum].childNodes[2].childNodes[3].childNodes[3].innerHTML =
          namee;
        target[eventNum].childNodes[2].childNodes[3].childNodes[5].innerHTML =
          locc;
        target[eventNum].style.backgroundColor = "transparent";
        populateTarget = target[eventNum].childNodes[2].childNodes[3];
        populateTarget.style.backgroundColor = "white";
        target[eventNum].childNodes[0].childNodes[3].style.backgroundColor =
          "white";
        target[eventNum].childNodes[0].childNodes[1].style.height =
          target[eventNum].childNodes[0].childNodes[3].style.height;
        target[eventNum].childNodes[1].textContent = "";
        hourStartBoolean = true;
        eventCollisonsDataCounter++;
      } else {
        map.set(eventCollisonsDataCounter, startTime);
        first = hours[i].offsetTop;
        target[i].innerHTML = divvv;
        target[i].childNodes[0].childNodes[3].childNodes[3].innerHTML = namee;
        target[i].childNodes[0].childNodes[3].childNodes[5].innerHTML = locc;
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

        target[i].style.width = `${
          offsetRight / (findMaxEventLinkedandWidth() + 1)
        }px`; //the above sol is absolutely right
        hourStartBoolean = true;

        /////////Positiong/////////////

        let max = findMaxEventLinkedandWidth();
        let followingCollisions = eventCollisonsData[eventCollisonsDataCounter];

        //console.log(max);
        //console.log(followingCollisions.length);

        let lefttt = 140;
        let Width = parseInt(target[i].style.width);

        followingCollisions == null
          ? (followingCollisions = 0)
          : followingCollisions;

        //console.log(typeof (max < followingCollisions.length ? i : i + 1));
        for (let i = 0; i < followingCollisions.length; i++) {
          let index = eventCollisonsDataCounter;
          if (index < followingCollisions[i]) {
            let n = 0;
            if (index > 0 && index != followingCollisions.length - 1) {
              if (followingCollisions.length < max) n = 1;
            }
            lefttt = lefttt + Width * (i + n);
            break;
          }
          if (
            i == followingCollisions.length - 1 &&
            index >= followingCollisions[i]
          ) {
            let numm = 0;
            if (followingCollisions.length < max) numm = 1;
            lefttt = lefttt + Width * (followingCollisions.length + numm);
          }
        }

        // At last setting width
        target[i].style.left = `${lefttt + 4}px`;

        /////incrementing Counter Variable

        eventCollisonsDataCounter++;
      }
    }
    if (hours[i].textContent.substring(13, 18) == endTime) {
      second = hours[i].offsetTop;
      //target[i].innerHTML = divvv;
    }

    if (halfHours[i].textContent == startTime) {
      map.set(eventCollisonsDataCounter, startTime);
      //first = halfHours[i].offsetTop;
      halfHourTarget[i].innerHTML = divvv;
      halfHourTarget[i].childNodes[0].childNodes[3].childNodes[3].innerHTML =
        namee;
      halfHourTarget[i].childNodes[0].childNodes[3].childNodes[5].innerHTML =
        locc;
      halfHourTarget[i].style.top = "45px";
      //setting popluate length respective to hours[i]
      first = hours[i].offsetTop;
      populateTarget = halfHourTarget[i].childNodes[0].childNodes[3];

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

      let offsetRight = window.innerWidth - halfHourTarget[i].offsetLeft * 1.8; //or acutally 2 ;

      halfHourTarget[i].style.width = `${
        offsetRight / (findMaxEventLinkedandWidth() + 1)
      }px`; //the above sol is absolutely right

      /////////Positiong/////////////

      let max = findMaxEventLinkedandWidth();
      let followingCollisions = eventCollisonsData[eventCollisonsDataCounter];

      let lefttt = 140;
      let Width = parseInt(halfHourTarget[i].style.width);
      followingCollisions == null
        ? (followingCollisions = 0)
        : followingCollisions;
      for (let i = 0; i < followingCollisions.length; i++) {
        let index = eventCollisonsDataCounter;
        if (index < followingCollisions[i]) {
          let n = 0;
          if (index > 0 && index != followingCollisions.length - 1) {
            if (followingCollisions.length < max) n = 1;
          }
          lefttt = lefttt + Width * (i + n);
          break;
        }
        if (
          i == followingCollisions.length - 1 &&
          index >= followingCollisions[i]
        ) {
          let numm = 0;
          if (followingCollisions.length < max) numm = 1;
          lefttt = lefttt + Width * (followingCollisions.length + numm);
        }
      }
      // At last setting width
      halfHourTarget[i].style.left = `${lefttt + 4}px`;

      /////incrementing Counter Variable

      eventCollisonsDataCounter++;
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
  }

  let eventHeight = second - first;
  populateTarget.style.height = `${eventHeight - 3}px`;

  parseInt(eventHeight) > 92
    ? (populateTarget.style.flexDirection = "column")
    : (populateTarget.style.flexDirection = "row");
}

data.map((e) => {
  DisplayEvent(e.StartTime, e.EndTime, e.itemName, e.itemLoc);
});
console.log(map);
