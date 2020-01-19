var config = {
  apiKey: "AIzaSyD1hFb1qK-M07j6N9d1jErVsSirUC4-Aio",
  authDomain: "entreehackathon.firebaseapp.com",
  databaseURL: "https://entreehackathon.firebaseio.com",
  projectId: "entreehackathon",
  storageBucket: "entreehackathon.appspot.com",
  messagingSenderId: "714748315315",
  appId: "1:714748315315:web:b3074f38e932a6cf3612c6",
  };

firebase.initializeApp(config);
 

//Reference for form collection(3)
let formMessage = firebase.database().ref('register');

//listen for submit event//(1)
document
  .getElementById('registrationform')
  .addEventListener('submit', formSubmit);

//Submit form(1.2)
function formSubmit(e) {
  e.preventDefault();
  // Get Values from the DOM
  let firstName = document.querySelector('#firstName').value;
  let lastName = document.querySelector('#lastName').value;
  let email = document.querySelector('#email2').value;
  let cities = document.querySelector('#cities').value;
  let interest1 = document.querySelector('#interest1').value;
  let interest2 = document.querySelector('#interest2').value;
  let interest3 = document.querySelector('#interest3').value;
  let movie = document.querySelector('#movie').value;
  let noun1 = document.querySelector('#noun1').value;
  let noun2 = document.querySelector('#noun2').value;
  let noun3 = document.querySelector('#noun3').value;
  let adjective1 = document.querySelector('#adjective1').value;
  let adjective2 = document.querySelector('#adjective2').value;
  let adjective3 = document.querySelector('#adjective3').value;
  let verb1 = document.querySelector('#verb1').value;
  let verb2 = document.querySelector('#verb2').value;
  let verb3 = document.querySelector('#verb3').value;
  let cat_dog = document.querySelector('#cat_dog').value;

  //send message values
  sendMessage(firstName, lastName, email, cities, interest1, interest2, interest3, movie, noun1, noun2, noun3, 
    adjective1, adjective2, adjective3, verb1, verb2, verb3, cat_dog);

  //Show Alert Message(5)
  document.querySelector('.alert').style.display = 'block';

  //Hide Alert Message After Seven Seconds(6)
  setTimeout(function() {
    document.querySelector('.alert').style.display = 'none';
  }, 7000);

  //Form Reset After Submission(7)
  document.getElementById('registrationform').reset();
}

//Send Message to Firebase(4)

function sendMessage(firstName, lastName, email, cities, interest1, interest2, interest3, movie, noun1, noun2, noun3, 
    adjective1, adjective2, adjective3, verb1, verb2, verb3, cat_dog) {
  let newFormMessage = formMessage.push();
  newFormMessage.set({
    firstName: firstName,
    lastName: lastName,
    email: email,
    cities: cities,
    interest1: interest1,
    interest2: interest2,
    interest3: interest3,
    movie: movie,
    noun1: noun1,
    noun2: noun2,
    noun3: noun3,
    adjective1: adjective1,
    adjective2: adjective2,
    adjective3: adjective3,
    verb1: verb1,
    verb2: verb2,
    verb3: verb3,
    cat_dog: cat_dog,
  });
}