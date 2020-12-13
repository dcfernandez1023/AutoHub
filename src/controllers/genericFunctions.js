import { v4 as uuidv4 } from 'uuid';

export function getYears(startYear) {
  var currentYear = new Date().getFullYear();
  var years = [];
  while(currentYear >= startYear) {
    years.push(currentYear--);
  }
  return years;
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
