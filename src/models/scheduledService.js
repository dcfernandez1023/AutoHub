export const scheduledService = {
  userCreated: "",
  serviceId: "",
  serviceType: "scheduled",
  datePerformed: "",
  serviceName: "",
  mileage: "",
  nextServiceDate: "",
  nextServiceMileage: 0,
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
    prependValue: "",
    headerButtonValue: ""
  },
  {
    value: "serviceName",
    displayName: "Service Name",
    type: "string",
    inputType: "select",
    tableWidth: "200px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: "+"
  },
  {
    value: "mileage",
    displayName: "Mileage",
    type: "number",
    inputType: "input",
    tableWidth: "100px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: ""
  },
  {
    value: "nextServiceDate",
    displayName: "Next Service Date",
    type: "string",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: ""
  },
  {
    value: "nextServiceMileage",
    displayName: "Next Service Mileage",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: ""
  },
  {
    value: "partsCost",
    displayName: "Parts Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$",
    headerButtonValue: ""
  },
  {
    value: "laborCost",
    displayName: "Labor Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$",
    headerButtonValue: ""
  },
  {
    value: "totalCost",
    displayName: "Total Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$",
    headerButtonValue: ""
  },
  {
    value: "notes",
    displayName: "Notes",
    type: "string",
    inputType: "input",
    tableWidth: "225px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: ""
  }
]
