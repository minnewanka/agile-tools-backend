/* eslint-disable no-undef*/ // no need to import Parse in cloud functions
var Vote = Parse.Object.extend("Vote")

Parse.Cloud.beforeSave("Vote", async request => {
  var vote = request.object

  const maxLengthName = 20
  if (vote.get("username") && vote.get("username").length > maxLengthName) {
    return Promise.reject({
      code: "ERR-003",
      message: `Participant username length must be less than ${maxLengthName} characters long`
    })
  }

  var checkIfAlreadyExist = async () => {
    var query = new Parse.Query(Vote)
    var existingVote = await query
      .equalTo("username", vote.get("username"))
      .equalTo("roomCode", vote.get("roomCode"))
      .first()
      .then(existingVote => {
        if (
          existingVote &&
          vote.get("username") === existingVote.get("username") &&
          vote.id !== existingVote.id
        ) {
          return Promise.reject({
            code: "ERR-001",
            message: `Participant with name ${vote.get(
              "username"
            )} already exist`
          })
        }
      })
  }

  var checkifAvailableSpace = async () => {
    const maxParticipants = 20
    var query = new Parse.Query(Vote)
    const participants = await query
      .equalTo("roomCode", vote.get("roomCode"))
      .find()
    if (
      !participants.map(participant => participant.id).includes(vote.id) &&
      participants.length >= maxParticipants
    ) {
      return Promise.reject({
        code: "ERR-002",
        message: `Room with code ${vote.get(
          "roomCode"
        )} is full (max ${maxParticipants} participants)`
      })
    }
  }
  await checkifAvailableSpace()
  await checkIfAlreadyExist()
})
