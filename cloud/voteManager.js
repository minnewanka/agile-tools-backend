/* eslint-disable no-undef*/ // no need to import Parse in cloud functions
var Vote = Parse.Object.extend("Vote")

Parse.Cloud.beforeSave("Vote", async request => {
  var vote = request.object

  if (vote.get("username") && vote.get("username").length > 25) {
    return Promise.reject({
      code: "ERR-003",
      message:
        "Participant username length must be less than 25 characters long"
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
  await checkIfAlreadyExist()
})
