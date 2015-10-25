# Description:
#   Boom.

module.exports = (robot) ->
  robot.hear /boom/i, (res) ->
    res.send 'shakalaka'
