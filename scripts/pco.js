// Description:
//   PCO integration.

var request = require('request-promise');

var SERVICE_TYPE = process.env.SERVICE_TYPE;
var BASE = 'https://api.planningcenteronline.com/services/v2';

// Defaults don't include base so we can use the links in the response data
var req = request.defaults({
  auth: {
    user: process.env.PCO_USER,
    pass: process.env.PCO_PASS
  },
  json:true
});

module.exports = function (robot) {
  robot.respond(/upcoming songs/i, function (chat) {
    var msg = '';
    // Get upcoming service
    req.get(`${BASE}/service_types/${SERVICE_TYPE}/plans?filter=future`)
      .then(res => res.data[0].links.self)
      // Add date to message
      .then(req).tap(plan => msg += `${plan.data.attributes.dates}\n`)
      // Get songs
      .then(res => res.data.links.items)
      .then(items => req(`${items}?include=key`)).get('data')
      .filter(item => item.attributes.item_type === 'song')
      // Get key for each song
      .map(function (song) {
        return req(song.relationships.key.links.related)
          .then(key => key.data.attributes.starting_key)
          .then(key => ({
            title: song.attributes.title,
            key
          }));
      })
      // Append each song to message (specifically not using reduce)
      .each(song => msg += `${song.title} [${song.key}]\n`)
      .then(() => chat.send(msg.trim()));
  });
};
