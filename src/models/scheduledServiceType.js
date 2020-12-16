export const scheduledServiceType = {
  userCreated: "",
  typeId: "",
  serviceName: "",
  carsScheduled: {} //ex: {carId: {miles: 5000, time: {quantity: 6, units: months}}}
}

export const privateFields = [
  "userCreated",
  "typeId"
]

export const publicFields = [
  {
    value: "serviceName",
    displayName: "Service Name",
    type: "string",
    required: true
  },
  {
    value: "carsScheduled",
    displayName: "Cars Scheduled",
    type: "object",
    required: false
  }
]

export const interval = {
  miles: 0,
  time: {quantity: 0, units: ""}
}

export const timeUnits = [
  {
    value: "day",
    displayName: "Day(s)"
  },
  {
    value: "week",
    displayName: "Week(s)"
  },
  {
    value: "month",
    displayName: "Month(s)"
  },
  {
    value: "year",
    displayName: "Year(s)"
  }
]
