const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

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
  notes: ""
}

export const privateFields = [
  "userCreated",
  "carId",
  "imageId"
]

export const publicFields = [
  {
    value: "name",
    displayName: "Name",
    type: "string",
    inputType: "input",
    modalColSpan: 6,
    modalSelectData: [],
    required: true
  },
  {
    value: "mileage",
    displayName: "Mileage",
    type: "number",
    inputType: "input",
    modalColSpan: 6,
    modalSelectData: [],
    required: true
  },
  {
    value: "year",
    displayName: "Year",
    type: "string",
    inputType: "select",
    modalColSpan: 4,
    modalSelectData: GENERICFUNCTIONS.getYears(1900),
    required: true
  },
  {
    value: "make",
    displayName: "Make",
    type: "string",
    inputType: "input",
    modalColSpan: 4,
    modalSelectData: [],
    required: true
  },
  {
    value: "model",
    displayName: "Model",
    type: "string",
    inputType: "input",
    modalColSpan: 4,
    modalSelectData: [],
    required: true
  },
  {
    value: "licensePlate",
    displayName: "License Plate #",
    type: "string",
    inputType: "input",
    modalColSpan: 12,
    modalSelectData: [],
    required: false
  },
  {
    value: "vinNumber",
    displayName: "VIN #",
    type: "string",
    inputType: "input",
    modalColSpan: 12,
    modalSelectData: [],
    required: false
  },
  {
    value: "notes",
    displayName: "Notes",
    inputType: "textarea",
    modalColSpan: 12,
    modalSelectData: [],
    required: false
  },
]
