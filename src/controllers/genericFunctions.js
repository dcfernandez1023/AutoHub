import { v4 as uuidv4 } from 'uuid';

export function getYears(startYear) {
  var currentYear = new Date().getFullYear();
  var years = [];
  while(currentYear >= startYear) {
    years.push(currentYear--);
  }
  return years;
}

export function trimInputs(jsonData) {
  for(var key in jsonData) {
    if(typeof(jsonData[key]) === "string" || isNaN(jsonData[key])) {
      console.log(jsonData[key]);
      console.log(key);
      jsonData[key] = jsonData[key].trim();
    }
    else if(!isNaN(jsonData[key])) {
      jsonData[key] = Number(jsonData[key].toString().trim());
    }
  }
  return jsonData;
}

export function randomColors(numColors) {
  var colors = [];
  const MAXCOLORS = 147;
  var letters = "0123456789ABCDEF";
  var n = 0;
  while(n < numColors) {
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 16))];
     }
     if(!colors.includes(color)) {
       colors.push(color);
     }
     if(n === MAXCOLORS) {
       return [];
     }
     n++;
  }
  return colors;
}

//returns an incremented date Object
/*
  dateObj - the date the increment
  timeUnits - time measurement (day, week, month, or year)
  timeStep - quantity to increment by
*/
export function incrementDate(dateObj, timeUnits, timeStep) {
  if(timeUnits === "day") {
    dateObj.setDate(dateObj.getDate() + timeStep);
  }
  else if(timeUnits === "week") {
    dateObj.setDate(dateObj.getDate() + (7*timeStep))
  }
  else if(timeUnits === "month") {
    dateObj.setMonth(dateObj.getMonth() + timeStep);
  }
  else if(timeUnits === "year") {
    dateObj.setFullYear(dateObj.getFullYear() + timeStep);
  }
  return dateObj;
}

export function imageToBase64(file, callback, callbackOnError) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    callback(reader.result);
  };
  reader.onerror = function(error) {
    callbackOnError(error);
  }
}

export function generateId() {
  return uuidv4().toString() + getRandomString() + new Date().getTime().toString();
}

function getRandomString() {
  const LEN = 10;
  var random = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < LEN; i++) {
    random = random + characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return random;
}
