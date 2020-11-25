export function getRandomString() {
  const LEN = 10;
  var random = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < LEN; i++) {
    random = random + characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return random;
}

export function getYears(startYear) {
  var currentYear = new Date().getFullYear();
  var years = [];
  while(currentYear >= startYear) {
    years.push(currentYear--);
  }
  return years;
}
