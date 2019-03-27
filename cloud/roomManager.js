/* eslint-disable no-undef*/ // no need to import Parse in cloud functions
var Room = Parse.Object.extend("Room")

var generateCodeNumber = () => {
  var CODE_NUMBER_LENGTH = 5
  var codeNumber = ""
  var possible = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  for (var i = 0; i < CODE_NUMBER_LENGTH; i++) {
    codeNumber += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return codeNumber
}

/**
 *   Generate an unique code when a new Room is being created
 */
Parse.Cloud.beforeSave("Room", async request => {
  var room = request.object

  if (room.get("name").length > 25) {
    return Promise.reject({
      code: "ERR-003",
      message: "Room name length must be less than 25 characters long"
    })
  }

  var MAX_TRIAL_COUNT = 5
  var trialCount = 0
  var tryCreateNewCodeNumber = async () => {
    trialCount++
    var newCodeNumber = generateCodeNumber()
    var query = new Parse.Query(Room)
    var existingOrder = await query
      .equalTo("code", newCodeNumber)
      .first()
      .then(existingOrder => {
        if (existingOrder) {
          if (trialCount >= MAX_TRIAL_COUNT) {
            throw { code: 1011, message: "A server error occurred." }
          } else {
            //code number duplicated, retrying...
            tryCreateNewCodeNumber()
          }
        } else {
          //set code room ..")
          var room = request.object
          room.set("code", newCodeNumber)
        }
      })
  }
  await tryCreateNewCodeNumber()
})
