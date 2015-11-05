# Description:
#   Boom.

module.exports = (robot) ->
  robot.respond /bad robot/i, (res) ->
    res.send "I'm sorry."
