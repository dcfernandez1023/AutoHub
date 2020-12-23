export const scheduledService = {
  userCreated: "",
  serviceId: "",
  serviceType: "scheduled",
  datePerformed: "",
  serviceName: "",
  sstRefId: "",
  mileage: 0,
  nextServiceDate: "",
  nextServiceMileage: "",
  partsCost: 0,
  laborCost: 0,
  totalCost: 0,
  notes: "",
  test: ""
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
    tableWidth: "125px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: "",
    disabled: false
  },
  {
    value: "serviceName",
    displayName: "Service Name",
    type: "string",
    inputType: "select",
    tableWidth: "200px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: "+",
    disabled: false
  },
  {
    value: "mileage",
    displayName: "Mileage",
    type: "number",
    inputType: "input",
    tableWidth: "100px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: "",
    disabled: false
  },
  {
    value: "nextServiceDate",
    displayName: "Next Service Date",
    type: "string",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: "",
    disabled: true
  },
  {
    value: "nextServiceMileage",
    displayName: "Next Service Mileage",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: "",
    disabled: true
  },
  {
    value: "partsCost",
    displayName: "Parts Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$",
    headerButtonValue: "",
    disabled: false
  },
  {
    value: "laborCost",
    displayName: "Labor Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$",
    headerButtonValue: "",
    disabled: false
  },
  {
    value: "totalCost",
    displayName: "Total Cost",
    type: "number",
    inputType: "input",
    tableWidth: "125px",
    containsPrepend: true,
    prependValue: "$",
    headerButtonValue: "",
    disabled: false
  },
  {
    value: "notes",
    displayName: "Notes",
    type: "string",
    inputType: "input",
    tableWidth: "225px",
    containsPrepend: false,
    prependValue: "",
    headerButtonValue: "",
    disabled: false
  }
]
