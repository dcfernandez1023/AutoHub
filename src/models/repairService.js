export const repairService = {
  userCreated: "",
  serviceId: "",
  serviceType: "repair",
  datePerformed: "",
  serviceName: "",
  mileage: "",
  partsCost: 0,
  laborCost: 0,
  totalCost: 0,
  notes: ""
}

export const privateFields = [
  "userCreated",
  "serviceId",
  "serviceType"
]

export const publicFields = [
  {
    value: "datePerformed",
    displayName: "Date Performed",
    type: "string",
    inputType: "input",
    tableWidth: "100px",
    containsPrepend: false,
    prependValue: ""
  },
  {
    value: "serviceName",
    displayName: "Service Name",
    type: "string",
    inputType: "input",
    tableWidth: "200px",
    containsPrepend: false,
    prependValue: ""
  },
  {
    value: "mileage",
    displayName: "Mileage",
    type: "number",
    inputType: "input",
    tableWidth: "100px",
    containsPrepend: false,
    prependValue: ""
  },
  {
    value: "partsCost",
    displayName: "Parts Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$"
  },
  {
    value: "laborCost",
    displayName: "Labor Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$"
  },
  {
    value: "totalCost",
    displayName: "Total Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$"
  },
  {
    value: "notes",
    displayName: "Notes",
    type: "string",
    inputType: "input",
    tableWidth: "225px",
    containsPrepend: false,
    prependValue: ""
  }
]
