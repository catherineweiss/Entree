// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// // **** THIS SECTION USED FOR welcomeMessage ****

// // The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');
// //   admin.initializeApp(); //THIS IS WHAT WE USED W/O TRYING TO GET INTO DATABASE

// // Fetch the service account key JSON file contents
// var serviceAccount = require('./serviceAccountKey.json');
  
// // Initialize the app with a service account, granting admin privileges
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://entreehackathon.firebaseio.com'
//   });
  
// // As an admin, the app has access to read and write all data, regardless of Security Rules
// var db = admin.database();
// var ref = db.ref("restricted_access/secret_document");
// ref.once("value", function(snapshot) {
//     console.log(snapshot.val());
//   });
  
// const sgMail = require("@sendgrid/mail");
// const cors = require("cors")({
//   origin: true
// });

// // **** END ****


// *******
// Difference between firebase and firebase-admin: https://stackoverflow.com/questions/42958776/whats-the-difference-between-the-firebase-and-the-firebase-admin-npm-module

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
var db = admin.database(app);
// var ref = db.ref("week");

// let array_results = [];
// let week_number = 0;

// // Attach an asynchronous callback to read the data at our posts reference
// ref.on("value", function(snapshot) {

//     week_number = snapshot.val();

//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });


// ref.on("value", function(snapshot) {

//     week_number = snapshot.val();

//   console.log(week_number);
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

var email = db.ref("emailLineup");

// email.on("value", function(snapshot) {

//     let emailData = snapshot.val();
//     console.log(emailData);

// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

// //MOVED LINES 89-96 TO INSIDE FUNCTION
// let emailReceipients = [];
// let week = 1; 
// email.orderByChild("week").equalTo(week).on("child_added", function(snapshot){

//     let emailData = snapshot.val();
//     console.log(emailData);

// });


// console.log(emailData);


//to use forEach()


//added sgMail and cors to Girri's code
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({
  origin: true
});

exports.welcomeMS5 = functions.https.onRequest((req, res) => {
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
    // personalizations_values.push({
    //   to: emailData.email1,
    //   dynamic_template_data:{
    //     name1: emailData.name1,
    //     name2: emailData.name2
    //   } 
    // }) ;

  //  matchesToMake.push(emailData);
  });


//  matchesToMake.forEach(el => {
//    personalizations_values.push(
//      {
//       to: [{email: el.email1}, {email: el.email2}] ,
//       dynamic_template_data:{
//         name1: el.name1,
//         name2: el.name2
//       }
//      }
//    )
//  }) 


  // personalizations_values = [
  //   {
  //     to: [
  //       {
  //         email: "catherine.f.weiss@gmail.com"
  //       },
  //       {
  //         email: "girri@seas.upenn.edu"
  //       }
  //     ],
  //     dynamic_template_data:{
  //       name1: "Catherine",
  //       name2: "Girri"
  //     },
  //     subject: "Hello, World Again!"      
  //   },
  //   {
  //     to: [
  //       {
  //         email: "walkerclaire24@gmail.com"
  //       },
  //       {
  //         email: "catweiss@seas.upenn.edu"
  //       }
  //     ],
  //     dynamic_template_data:{
  //       name1: "Catherine",
  //       name2: "Girri"
  //     },
  //     subject: "Hello, World ONE!"
  //   }
  // ] ;

//call send message

function sendMail(){
  sgMail.send(msg);
}

setTimeout(sendMail, 25000) ;  
// sgMail.send(msg);  
if (matchesToMake.length > 1){
  res.status(200).send("We got more than 1 object");
} else
    res.status(404).send("1 or fewer objects");
});

exports.welcomeMS4 = functions.https.onRequest((req, res) => {
    let week = 2; 
    sgMail.setApiKey("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");
    email.orderByChild("week").equalTo(week).on("child_added", function(snapshot){

        let emailData = snapshot.val();
        let emailReceipients = [emailData.email1, emailData.email2]

            const msg = {
              to: emailReceipients,
              from: "catweiss@seas.upenn.edu",
              subject: "Email sent to Week 1 Matches" ,
              templateId: 'd-e52ab14ef8ad4331b809a2dda425778e', 
              dynamic_template_data:{
                name1: emailData.name1,
                name2: emailData.name2
              }
            };

            sgMail.send(msg);
            console.log('Success!') ;
      res.status(200).send("success");
    })
    
});  

//******** 


// // WORKING WITH TOP SECTION

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


//exports.welcomeMessageWithDB = functions.https.onRequest((req, res) => {
  //const matches = await admin.firestore().collection('emailLineup').get(); //TODO query based on week
  
  //put for loop, iterate through all matches from Week 'x'
  //const email = matches.docs.map(snap => snap.data().email1)









// exports.welcomeMessageWithDB = functions.https.onRequest((req, res) => {
//     //const matches = await admin.firestore().collection('emailLineup').get(); //TODO query based on week
    
//     //put for loop, iterate through all matches from Week 'x'
//     //const email = matches.docs.map(snap => snap.data().email1)

//     var matches = [];
//     var week = 1; 

//     email.orderByChild("week").equalTo(week).on("child_added", function(snapshot){
    
//         var emailData = snapshot.val();
//         console.log(emailData);
    
//     });

//     // use forEach to add email addresses to emailRecipients
//     emailData.array.forEach(element => {
//       //call function that sends email
      
//       matches.push() ;
//     });
    



//     // get remainder of content from DB and store in local variables. This will be added to email message content


//     return cors(req, res, () => {
//       const msg = {
//         to: emailReceipients,
//         from: "catweiss@seas.upenn.edu",
//         subject: "Email sent to Week 1 Matches" ,
//         templateId: 'd-e52ab14ef8ad4331b809a2dda425778e'
//       };
//       sgMail.setApiKey(
//         "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"
//       );
//       sgMail.send(msg);
//       res.status(200).send("success");
//     }).catch(() => {
//       res.status(500).send("error");
//     });
// });

