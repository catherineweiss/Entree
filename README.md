# Entree - An App For Warm Introductions

Entree is a warm introduction designed to connect you to classmates and colleagues.  It takes information from users via an online form.  The app then analyzes possible matches using our matching algorithm using natural language processing.  Users are then sent one email per week introducing them to individuals that share common interests, backgrounds, and goals.

The app starts with a form containing simple but fun questions.  Sam built this component of the app on Google Firebase.  It takes user data and saves it to a Firebase database.  The frontend also enables users to securely log in and edit their information.

The backend of the app scores potential matches between users.  The scoring is based on similarity of interests, movie preference, and favorite city.  The backend uses the spaCy NLP module to analyze similarity for fields that are not restricted to a set of choices.  Once all potential matches have been scored, they are ranked and selected.  The backend then updates the database so that matches will not be reselected in the future.  This process can be repeated until all possible matches have been exhausted.  Dan build this component of the app using Python and Firebase and hosted it on a digitalocean server so it can be scheduled to run automatically.

TO DO: EXPLANATION OF EMAIL SYSTEM

Development Team:

Girri Panalyipan

Catherine Weiss

Claire Walker

Samuel Attal

Daniel Ciarrocki


