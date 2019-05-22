'use strict'

// no need to import Parse in cloud functions
/* eslint-disable no-undef*/
Parse.Cloud.define('getAppStats', async request => {

  var getCurrentRoomCount = async () => {
    var Room = Parse.Object.extend("Room")
    var queryRoom = new Parse.Query(Room)
    return queryRoom.count()
  }

  var getCurrentParticipantCount = async () => {
    var Vote = Parse.Object.extend("Vote")
    var queryVote = new Parse.Query(Vote)
    return queryVote.count()
  }

  var getRoomsCreatedCount = async () => {
    const Stats = Parse.Object.extend('Stats')
    const query = new Parse.Query(Stats)
    query.equalTo('key', 'totalRooms')
    const totalRoomsObj = await query.first()
    return totalRoomsObj ? totalRoomsObj.get("value") : undefined

  }
  var getTotalParticipantsCount = async () => {
    const Stats = Parse.Object.extend('Stats')
    const query = new Parse.Query(Stats)
    query.equalTo('key', 'totalParticipants')
    const totalParticipantsObj = await query.first()
    return totalParticipantsObj ? totalParticipantsObj.get("value") : undefined

  }

  var getTotalVoteCount = async () => {
    const Stats = Parse.Object.extend('Stats')
    const query = new Parse.Query(Stats)
    query.equalTo('key', 'totalVotes')
    const totalVotesObj = await query.first()
    return totalVotesObj ? totalVotesObj.get("value") : undefined

  }

  const [currentRooms, currentParticipants, totalRooms, totalParticipants, totalVotes] = await Promise.all([getCurrentRoomCount(),
    getCurrentParticipantCount(), getRoomsCreatedCount(), getTotalParticipantsCount(), getTotalVoteCount()
  ])


  return {
    currentRooms: currentRooms,
    currentParticipants: currentParticipants,
    totalRooms: totalRooms,
    totalParticipants: totalParticipants,
    totalVotes: totalVotes
  }

})