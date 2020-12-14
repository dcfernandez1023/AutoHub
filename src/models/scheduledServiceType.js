export const scheduledServiceType = {
  userCreated: "",
  typeId: "",
  serviceName: "",
  carsScheduled: {}
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
