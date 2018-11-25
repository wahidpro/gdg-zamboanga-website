(function() {
  // Initialize Firebase
  const config = {
      apiKey: "AIzaSyC0rJSN8XAaZx7-c7Kfr7plRepEtu_u7-U",
      authDomain: "gdg-zamboanga-website-573f2.firebaseapp.com",
      databaseURL: "https://gdg-zamboanga-website-573f2.firebaseio.com",
      projectId: "gdg-zamboanga-website-573f2",
      storageBucket: "gdg-zamboanga-website-573f2.appspot.com",
      messagingSenderId: "901776976327"
      };
  firebase.initializeApp(config);

  // Get Elements
  
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');

  // Login Event
  btnLogin.addEventListener('click', e => {
    //Get email and password fields
    const email = txtEmail.value;
    const password = txtPassword.value;
    //Store firebase auth
    const auth = firebase.auth();
    //Log in
    const promise = auth.signInWithEmailAndPassword(email,
      password);
    promise
    .then(e => window.location = "./../admin")
    .catch(e => console.log(e.message));

  });

  // Sign up Event
  btnSignUp.addEventListener('click', e => {
    //Get email and password fields
    //TODO: Check if email is valid
    const email = txtEmail.value;
    const password = txtPassword.value;
    //Store firebase auth
    const auth = firebase.auth();

    
    //Sign up
    const promise = auth.createUserWithEmailAndPassword(email,password);
    promise
    .then(e => window.location = "./../admin")
    .catch(e => console.log(e.message));

  });

  // Real-time listener for events
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log(firebaseUser);      
    } else {
      console.log('Not logged in');
    }
  });

}());

