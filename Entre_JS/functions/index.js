// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// Access private API keys 
var config = require('./config.js');

// Add Firebase SDK
var firebase = require("firebase");

// Import Admin SDK
var admin = require("firebase-admin");

var app = firebase.initializeApp(config);
console.log(config) ;


// Access database with email information
var db = admin.database(app);

var email = db.ref("emailLineup");

// Import Sendgrid API
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({
  origin: true
});

// This was our final attempt to get the Cloud Function to run without timing out
// Unfortunately, the function did not deploy!
exports.matchingSDR = functions.https.onRequest((req, res) => {
  let week = 4; 
  var emailData ;
  var matchesToMake = [] ;
  var personalizations_values = [] ;


 // We had to change sendgrid accounts (from Gerri to Claire) because we'd sent too many emails 
 // sgMail.setApiKey("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");
 sgMail.setApiKey("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");

  var msg = {
    personalizations: personalizations_values,
    from: "catweiss@seas.upenn.edu",
//  subject: "Email sent to Week 1 Matches" ,
  //templateId: 'd-e52ab14ef8ad4331b809a2dda425778e',
  templateId: 'd-82231e3bb66c4768bfc130946cf1590a'
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


// We brought back this earlier version and removed "success" message from being sent.
// Did not work. Can't remember if function deployed.  
// Create Cloud Function to Trigger Emails Being Sent Week 1
exports.matching1 = functions.https.onRequest((req, res) => {
  let week = 1; 
  var emailData ;
  var matchesToMake = [] ;
  var personalizations_values = [] ;

  //  sgMail.setApiKey("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"); //Girri's
sgMail.setApiKey("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");

  var msg = {
    personalizations: personalizations_values,
    from: "girri@seas.upenn.edu",
    //templateId: 'd-e52ab14ef8ad4331b809a2dda425778e',
    templateId: 'd-82231e3bb66c4768bfc130946cf1590a' 
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
//setTimeout(res.status(200).send("Success"), 27000) ;

 });


// **** WEEK 4 **** 

// This function deployed, but timed out when we tried to use it.
// We modified the time in setTimeout. We also modified when the success message would be sent. Neither was successful. 
// Create Cloud Function to Trigger Emails Being Sent Week 4
exports.matching4 = functions.https.onRequest((req, res) => {
  let week = 4; 
  var emailData ;
  var matchesToMake = [] ;
  var personalizations_values = [] ;

  //  sgMail.setApiKey("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"); //Girri's
sgMail.setApiKey("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");

  var msg = {
    personalizations: personalizations_values,
    from: "girri@seas.upenn.edu",
    //templateId: 'd-e52ab14ef8ad4331b809a2dda425778e',
    templateId: 'd-82231e3bb66c4768bfc130946cf1590a' 
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

setTimeout(sendMail, 40000) ;  
//setTimeout(res.status(200).send("Success"), 27000) ;
res.status(200).send('Success');

 });
 


// **** WEEK 5 **** 

// This includes last minute modifications, none of which resulted in emails being sent.
// Create Cloud Function to Trigger Emails Being Sent Week 5
exports.matching5 = functions.https.onRequest((req, res) => {
  let week = 5; 
  var emailData ;
  var matchesToMake = [] ;
  var personalizations_values = [] ;

//  sgMail.setApiKey("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"); //Girri's
  sgMail.setApiKey("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");

  var msg = {
    personalizations: personalizations_values,
    from: "girri@seas.upenn.edu",
    //templateId: 'd-e52ab14ef8ad4331b809a2dda425778e',
    templateId: 'd-82231e3bb66c4768bfc130946cf1590a' 
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

setTimeout(sendMail, 30000) ;  
setTimeout(function() {res.status(200).send("Success")}, 27000) ;

 });



// **** WEEK 6 **** 

// This includes last minute modifications, none of which resulted in emails being sent.
// Create Cloud Function to Trigger Emails Being Sent Week 6
exports.matching6 = functions.https.onRequest((req, res) => {
  let week = 6; 
  var emailData ;
  var matchesToMake = [] ;
  var personalizations_values = [] ;

  //  sgMail.setApiKey("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"); //Girri's
sgMail.setApiKey("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");

  var msg = {
    personalizations: personalizations_values,
    from: "girri@seas.upenn.edu",
    //templateId: 'd-e52ab14ef8ad4331b809a2dda425778e',
    templateId: 'd-82231e3bb66c4768bfc130946cf1590a' 
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
//setTimeout(res.status(200).send("Success"), 27000) ;

 }); 

 

// Cloud Function to send Welcome Message. 
// This created a function that successfully sent email. It is not connected to database. Not using for project.
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
