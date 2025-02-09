/* eslint-disable no-undef*/ // no need to import Parse in cloud functions
var Room = Parse.Object.extend('Room')

var generateCodeNumber = () => {
  var CODE_NUMBER_LENGTH = 5
  var codeNumber = ''
  var possible = '123456789'
  for (var i = 0; i < CODE_NUMBER_LENGTH; i++) {
    codeNumber += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return codeNumber
}

/**
 *   Generate an unique code when a new Room is being created
 */
Parse.Cloud.beforeSave('Room', async request => {
  var room = request.object
  const maxLengthName = 25
  if (room.get('name').length > maxLengthName) {
    return Promise.reject({
      code: 'ERR-004',
      message: `Room name length must be less than ${maxLengthName} characters long`
    })
  }

  if (!room.get('code')) {
    var MAX_TRIAL_COUNT = 5
    var trialCount = 0
    var tryCreateNewCodeNumber = async () => {
      trialCount++
      var newCodeNumber = generateCodeNumber()
      var query = new Parse.Query(Room)
      var existingOrder = await query.equalTo('code', newCodeNumber).first()

      if (existingOrder) {
        if (trialCount >= MAX_TRIAL_COUNT) {
          throw {
            code: 1011,
            message: 'A server error occurred.'
          }
        } else {
          //code number duplicated, retrying...
          tryCreateNewCodeNumber()
        }
      } else {
        //set code room ..")
        var room = request.object
        room.set('code', newCodeNumber)
        //init ceremony
        room.set('ceremony', "pokerplanning")
      }
    }
    await tryCreateNewCodeNumber()
  }
})