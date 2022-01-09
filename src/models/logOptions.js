export const sortOptions = [
  {
    value: "date",
    displayName: "Date"
  },
  {
    value: "mileage",
    displayName: "Mileage"
  },
  {
    value: "partsCost",
    displayName: "Parts Cost"
  },
  {
    value: "laborCost",
    displayName: "Labor Cost"
  },
  {
    value: "totalCost",
    displayName: "Total Cost"
  }
]

export const filterOptions = {
  date: {name: "date", displayName: "Date", filterType: "range", rangeOptions: [{name: "startDate", displayName: "Start Date"}, {name: "endDate", displayName: "End Date"}]},
  mileage: {name: "mileage", displayName: "Mileage", filterType: "range", rangeOptions: [{name: "startMileage", displayName: "Start Mileage"}, {name: "endMileage", displayName: "End Mileage"}]},
  serviceName: {name: "serviceName", displayName: "Service Name", filterType: "compare", rangeOptions: []}
}

export const filterValues = {
  startDate: null,
  endDate: null,
  startMileage: "",
  endMileage: "",
  serviceName: ""
}
