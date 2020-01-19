// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// Add Firebase SDK

var firebase = require("firebase");
// Import Admin SDK
var admin = require("firebase-admin");
var config = {
    apiKey: "AIzaSyD1hFb1qK-M07j6N9d1jErVsSirUC4-Aio",
    authDomain: "entreehackathon.firebaseapp.com",
    databaseURL: "https://entreehackathon.firebaseio.com",
    projectId: "entreehackathon",
    storageBucket: "entreehackathon.appspot.com",
    messagingSenderId: "714748315315",
    appId: "1:714748315315:web:b3074f38e932a6cf3612c6",
  };

var app = firebase.initializeApp(config);

// Access database with email information
var db = admin.database(app);

var email = db.ref("emailLineup");

// Import Sendgrid API
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({
  origin: true
});

exports.matching2 = functions.https.onRequest((req, res) => {
  let week = 1; 
  var emailData ;
  var matchesToMake = [] ;
  var personalizations_values = [] ;

  sgMail.setApiKey("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");

  var msg = {
    personalizations: personalizations_values,
    from: "catweiss@seas.upenn.edu",
//  subject: "Email sent to Week 1 Matches" ,
    templateId: 'd-e52ab14ef8ad4331b809a2dda425778e', 
  };

  email.orderByChild("week").equalTo(week).on("child_added", function(snapshot){

    emailData = snapshot.val();
    msg.personalizations.push(
      {
        to: [{email: emailData.email1}, {email: emailData.email2}] ,
        dynamic_template_data:{
          name1: emailData.name1,
          name2: emailData.name2
        }
       }
    ) ;

  });


//call send message function

function sendMail(){
  sgMail.send(msg);
}

setTimeout(sendMail, 25000) ;  
setTimeout(res.status(200).send("Success"), 27000) ;

 });
 

// Cloud Function to send Welcome Message. Not Using.
// exports.welcomeMessage = functions.https.onRequest((req, res) => {
//     return cors(req, res, () => {
//       const msg = {
//         to: "catweiss@seas.upenn.edu",
//         from: "catweiss+1@seas.upenn.edu",
//         subject: `Entree sent you a new message`,
//         templateId: 'd-847407afa980405f8e124b7a80991534'
//       };
//       sgMail.setApiKey(
//         "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"
//       );
//       sgMail.send(msg);
//       res.status(200).send("success");
//     }).catch( () => {  //TODO Fix TypeError: Cannot read property 'catch'
//       res.status(500).send("error");
//     });
// });
