'use strict';

var email_add = '';
var userId = '';

function init() {
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
}
/**
 * Handles the sign in button press.
 */
function handleLogin() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('txtEmail').value;
        var password = document.getElementById('txtPassword').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            alert('Bienvenidos!');
            window.location = './../admin';
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            //document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    //document.getElementById('quickstart-sign-in').disabled = true;
}

/**
 * Handles the sign out button press.
 */
function handleLogout() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        window.location = "./../admin/login.html";
        // [END signout]
    }
}

function toggleSignUp() {
    window.location = "./../admin/signup.html";
}

function toggleLogin() {
    window.location = "./../admin/login.html";
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    let email = document.getElementById('txtEmail').value;
    let password = document.getElementById('txtPassword').value;
    let firstName = document.getElementById('txtFirstName').value;
    let lastName = document.getElementById('txtLastName').value;

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(resp) {
        alert('Sign up has been succesfully done.');
        //INSERT TO DATABASE
        var userData = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
            uid: resp.user.uid,
            created_at: firebase.database.ServerValue.TIMESTAMP
        };

        let user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: firstName + ' ' + lastName
        }).then(function() {
            alert('success')
        }).catch(function(error) {
            alert(error);
        });

        let updates = {};
        updates['/users/' + resp.user.uid] = userData;

        let promise = firebase.database().ref('web').update(updates);
        promise.then(() => {
            window.location = './../admin/login.html';
            return promise;
        }).catch((err) => {
            console.log(err);
            return;
        })
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        alert('Please verify your email.');
        firebase.auth().signOut();
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = document.getElementById('txtEmail').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}



function createCategory() {

    let categoryName = document.getElementById('categoryName').value;
    let newCategoryKey = firebase.database().ref('web').child('category').push().key;
    let categoryData = {
        id: newCategoryKey,
        categoryName: categoryName,
        created_at: firebase.database.ServerValue.TIMESTAMP
    };

    let updates = {};
    updates['/category/' + newCategoryKey] = categoryData;
    let promise = firebase.database().ref('web').update(updates);

    promise.then(() => {
        alert(categoryName + ' has been saved succesfully.');
        document.getElementById('categoryName').value = ' ';
        document.getElementById('btnSaveCategory').disabled = true;
        document.getElementById('btnSaveCategory').textContent = 'Saving...';
        document.getElementById('btnSaveCategory').disabled = false;
        document.getElementById('btnSaveCategory').textContent = 'Save';
        return promise;
    }).catch((error) => {
        alert(error);
        return;
    });

}

function createCategoryElement(categoryId, categoryName, ctr) {

    let html = '<li class="collection-item category ' + categoryId + '"><span class="category-name"></span></li>';

    let ul = document.getElementById('category-list');
    ul.innerHTML += html;
    // Set values.
    document.getElementsByClassName('category-name')[ctr].innerText = categoryName;

}

function fetchCategory() {

    let categoryRef = firebase.database().ref('web').child('category');

    categoryRef.on('value', function(snapshot) {
        let ctr = 0;
        snapshot.forEach(function(childSnapshot) {
            createCategoryElement(childSnapshot.val().id, childSnapshot.val().categoryName, ctr);
            ctr++;
        });

    });

}

function createCategoryDropwdownElement(categoryName) {

    var select = document.getElementById('drpCategory');
    select.options[select.options.length] = new Option(categoryName, categoryName, false, false);
    
    $('select').formSelect();
}

function fetchCategoryDropwdown() {

    let categoryRef = firebase.database().ref('web').child('category');

    categoryRef.on('value', function(snapshot) {
       
        snapshot.forEach(function(childSnapshot) {
            createCategoryDropwdownElement(childSnapshot.val().categoryName);
           
        });

    });

}

function createBlog() {

    let blogTitle = document.getElementById('blog-title').value;
    let blogContent = document.getElementById('blog-content').value;
    let isBlog = document.getElementById('is-blog-cb-opt1').checked;
    let isDraft = document.getElementById('is-draft-cb').checked;


    let blogData;
    if (isBlog) {
        let category = document.getElementById('drpCategory').value;
        blogData = {
            title: blogTitle,
            content: blogContent,
            created_at: firebase.database.ServerValue.TIMESTAMP,
            created_by: email_add,
            modified_at: firebase.database.ServerValue.TIMESTAMP,
            status: {
                draft: isDraft,
                published: {
                    date_published: isDraft ? '' : firebase.database.ServerValue.TIMESTAMP,
                    status: isDraft
                }
            },
            type: {
                blog: {
                    status: true,
                    type: category,
                },
                event: {
                    date_start: '',
                    date_end: '',
                    location: '',
                    meetup_link: '',
                    status: false
                }
            },
            uid: userId
        };
      
    } else {
        //Event
        let eventStartDate = document.getElementById('date-start').value;
        let eventEndDate = document.getElementById('date-end').value;
        let eventLocation = document.getElementById('event-location').value;
        let eventMeetupLink = document.getElementById('event-meetup-link').value;

        blogData = {
            title: blogTitle,
            content: blogContent,
            created_at: firebase.database.ServerValue.TIMESTAMP,
            created_by: email_add,
            modified_at: firebase.database.ServerValue.TIMESTAMP,
            status: {
                draft: isDraft,
                published: {
                    date_published: isDraft ? '' : firebase.database.ServerValue.TIMESTAMP,
                    status: isDraft
                }
            },
            type: {
                blog: {
                    status: true,
                    type: 'Wala pa kasi dapat get sa categories'
                },
                event: {
                    date_start: eventStartDate,
                    date_end: eventEndDate,
                    location: eventLocation,
                    meetup_link: eventMeetupLink,
                    status: false
                }
            },
            uid: userId
        };
    }

    let newBlogKey = firebase.database().ref('web').child('blog').push().key;

    let updates = {};
    updates['/blog/' + newBlogKey] = blogData;
    let promise = firebase.database().ref('web').update(updates);

    promise.then(() => {
        alert(blogTitle + ' has been saved succesfully.');
        //Clear controls
        document.getElementById('blog-title').value = ' ';
        document.getElementById('blog-content').value = ' ';
        document.getElementById('is-blog-cb-opt1').checked = true;
        document.getElementById('is-blog-cb-opt2').checked = false;
        document.getElementById('is-draft-cb').checked = true;
        document.getElementById('event-location').value = ' ';
        document.getElementById('event-meetup-link').value = ' ';

        document.getElementById('btnSaveBlog').disabled = true;
        document.getElementById('btnSaveBlog').textContent = 'Saving...';
        document.getElementById('btnSaveBlog').disabled = false;
        document.getElementById('btnSaveBlog').textContent = 'Save';
        document.getElementById('drpCategory').value = -1;
        $('select').formSelect();
        return promise;
    }).catch((error) => {
        alert(error);
        return;
    });

}

function createBlogListElement(blogId, blogTitle, ctr) {

    let html = '<div class="col s12 blog ' + blogId + '">' +
            '<div class="card hoverable">' +
                '<div class="card-content">' +
                    '<span class="card-title blog-title">' +
                        '<span class="right badge blog-published"></span>' +
                    '</span>' +
                    '<span class="grey-text blog-date"></span>' +
                    '<a class="waves-effect waves-light yellow darken-3 btn right sub-menu" data-content="blog.html">VIEW</a>' +
                '</div>' +
            '</div>' +
        '</div>';
    let div = document.getElementById('blog-list');
    div.innerHTML += html;
    // Set values.
    document.getElementsByClassName('blog-title')[ctr].innerText = blogTitle;
    //document.getElementsByClassName('blog-published')[ctr].innerText = published ? 'Published':'Draft';
    //document.getElementsByClassName('blog-date')[ctr].innerText = blogDate === '' ? 'None':'Posted:&emsp;' + blogDate;

}

function fetchBlogList() {

    let blogRef = firebase.database().ref('web').child('blog');

    blogRef.on('value', function(snapshot) {
        let ctr = 0;
        snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot.key);
            createBlogListElement(childSnapshot.key, childSnapshot.val().title,ctr);
            ctr++;
        });

    });

}

function createMember() {

    let firstName = document.getElementById('firstname').value;
    let lastName = document.getElementById('lastname').value;
    let email = document.getElementById('email').value;
    let description = document.getElementById('description').value;

    let newMemberKey = firebase.database().ref('web').child('member').push().key;
    let memberData = {
        id: newMemberKey,
        firstName: firstName,
        lastName: lastName,
        email: email,
        description: description,
        created_at: firebase.database.ServerValue.TIMESTAMP
    };

    let updates = {};
    updates['/member/' + newMemberKey] = memberData;
    let promise = firebase.database().ref('web').update(updates);

    promise.then(() => {
        alert(firstname + ' ' + lastname + ' has been saved succesfully.');
        document.getElementById('firstname').value = ' ';
        document.getElementById('lastname').value = ' ';
        document.getElementById('email').value = ' ';
        document.getElementById('description').value = ' ';

        document.getElementById('btnSaveMember').disabled = true;
        document.getElementById('btnSaveMember').textContent = 'Saving...';
        document.getElementById('btnSaveMember').disabled = false;
        document.getElementById('btnSaveMember').textContent = 'Save';
        return promise;
    }).catch((error) => {
        alert(error);
        return;
    });

}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener
    init();
    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            email_add = email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            userId = uid;
            var providerData = user.providerData;

            //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            if (!emailVerified) {
                //document.getElementById('quickstart-verify-email').disabled = false;
                alert('Please verify your email address.');
                sendEmailVerification();
            }

            document.getElementById('account-name').textContent = email;

        } else {
            // User is signed out.
            console.log("Not logged in");
            window.location = "./../admin/login.html";
        }
    });
    // [END authstatelistener]



}

window.onload = function() {
    init();
};