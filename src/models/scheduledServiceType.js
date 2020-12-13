export const scheduledServiceType = {
  userCreated: "",
  typeId: "",
  serviceName: "",
  cars: [],
  carDeadlines: {}
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
    value: "cars",
    displayName: "Cars",
    type: "array",
    required: false
  }.
  {
    value: "carDeadlines",
    displayName: "Car Deadlines",
    type: "object",
    required: false
  }
]
