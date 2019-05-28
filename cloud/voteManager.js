/* eslint-disable no-undef*/ // no need to import Parse in cloud functions
var Vote = Parse.Object.extend('Vote')

Parse.Cloud.beforeSave('Vote', async request => {
  var vote = request.object

  const maxLengthName = 20
  if (vote.get('username') && vote.get('username').length > maxLengthName) {
    return Promise.reject({
      code: 'ERR-003',
      message: `Participant username length must be less than ${maxLengthName} characters long`
    })
  }

  var checkIfRoomExist = async () => {
    var Room = Parse.Object.extend('Room')
    var query = new Parse.Query(Room)
    var room = await query.equalTo('code', vote.get('roomCode')).first()
    if (!room) {
      return Promise.reject({
        code: 'ERR-005',
        message: `Room with code ${vote.get('roomCode')} doesn't exist`
      })
    }
  }

  var checkIfAlreadyExist = async () => {
    var query = new Parse.Query(Vote)
    var existingVote = await query
      .equalTo('username', vote.get('username'))
      .equalTo('roomCode', vote.get('roomCode'))
      .first()
    if (
      existingVote &&
      vote.get('username') === existingVote.get('username') &&
      vote.id !== existingVote.id
    ) {
      return Promise.reject({
        code: 'ERR-001',
        message: `Participant with name ${vote.get('username')} already exist`
      })
    }
  }

  var checkifAvailableSpace = async () => {
    const maxParticipants = 20
    var query = new Parse.Query(Vote)
    const participants = await query
      .equalTo('roomCode', vote.get('roomCode'))
      .find()
    if (
      !participants.map(participant => participant.id).includes(vote.id) &&
      participants.length >= maxParticipants
    ) {
      return Promise.reject({
        code: 'ERR-002',
        message: `Room with code ${vote.get(
          'roomCode'
        )} is full (max ${maxParticipants} participants)`
      })
    }
  }
  await checkIfRoomExist()
  await checkifAvailableSpace()
  await checkIfAlreadyExist()
})

Parse.Cloud.afterSave('Vote', async request => {


  var updateStats = async () => {
    const Stats = Parse.Object.extend("Stats")
    var queryStats = new Parse.Query(Stats)
    // It's a new participant 
    if (request.object.existed() === false) {
      queryStats.equalTo("key", "totalParticipants")
      const totalParticipantsObj = await queryStats.first()

      // if the counter exist
      if (totalParticipantsObj) {
        totalParticipantsObj.set("value", totalParticipantsObj.get("value") + 1)
        return totalParticipantsObj.save()

      } // if it is the first time we insert a participant, we create the counter
      else {

        const totalParticipantsStats = new Stats()
        totalParticipantsStats.set("key", "totalParticipants")
        totalParticipantsStats.set("value", 1)
        return totalParticipantsStats.save()
      }

    }
    // It's a vote
    else {
      queryStats.equalTo("key", "totalVotes")
      const totalVotesObj = await queryStats.first()

      // if the counter exist
      if (totalVotesObj) {
        totalVotesObj.set("value", totalVotesObj.get("value") + 1)
        return totalVotesObj.save()

      } // if it is the first time we insert a vote, we create the counter
      else {

        const totalVotesStats = new Stats()
        totalVotesStats.set("key", "totalVotes")
        totalVotesStats.set("value", 1)
        return totalVotesStats.save()
      }
    }
  }
  await updateStats()

})