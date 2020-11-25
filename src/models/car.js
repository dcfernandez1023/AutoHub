export const car = {
  userCreated: "",
  carId: "",
  imageId: "",
  year: "",
  make: "",
  model: "",
  name: "",
  licensePlate: "",
  mileage: 0,
  vinNumber: "",
}

export const privateFields = [
  "userCreated",
  "carId",
  "imageId"
]

export const publicFields = [
  {
    value: "year",
    displayName: "Year",
    type: "string",
    inputType: "select"
  },
  {
    value: "make",
    displayName: "Make",
    type: "string",
    inputType: "input"
  },
  {
    value: "model",
    displayName: "Model",
    type: "string",
    inputType: "input"
  },
  {
    value: "name",
    displayName: "Name",
    type: "string",
    inputType: "input"
  },
  {
    value: "licensePlate",
    displayName: "License Plate #",
    type: "string",
    inputType: "input"
  },
  {
    value: "mileage",
    displayName: "Mileage",
    type: "number",
    inputType: "input"
  },
  {
    value: "vinNumber",
    displayName: "VIN #",
    type: "string",
    inputType: "input"
  }
]
