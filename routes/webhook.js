var express = require('express');
var router = express.Router();
var chatServices = require('../server/chatService');

// Creates the endpoint for our webhook
router.post('/', (req, res) => {

  var body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      var webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      var sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      chatServices.sendTextMessage(webhook_event['sender']['id'], webhook_event['sender']['message']);

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


// Adds support for GET requests to our webhook
router.get('/', (req, res) => {

  // Your verify token. Should be a random string.
  var VERIFY_TOKEN = "EAARZAKGL7UGoBAGx1u5gcFs9nNKIXl1yc3hLq5vkXjAsT34JpCsdmrWtXaGC3hnWmlN6i4YYfEXhlvFTUtZAtDhJQpYYEudFZAd7iCM23dZBEPhEktPaX4Xrnk9VHCUGsfe6VZAir2LxKCZBT804qMfcr6AEl587ZCvKji2mkhi7V1rwe2ZBARXx"

  // Parse the query params
  var mode = req.query['hub.mode'];
  var token = req.query['hub.verify_token'];
  var challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
  res.sendStatus(403);
});

module.exports = router;
