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
        firebase.auth().signOut();
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
        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            alert('Bienvenidos!');
            window.location = './../admin';
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
    }
   
}

/**
 * Handles the sign out button press.
 */
function handleLogout() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        window.location = "./../admin/login.html";
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
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification().then(function() {
       
        alert('Email Verification Sent!');
        alert('Please verify your email.');
        firebase.auth().signOut();

    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = document.getElementById('txtEmail').value;
    
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      
        alert('Password Reset Email Sent!');
        
    }).catch(function(error) {
      
        var errorCode = error.code;
        var errorMessage = error.message;
       
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        
    });
    
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

    let html = '<li class="collection-item category ' + categoryId + '"><span class="category-name"></span>' +
                '<a class="waves-effect waves-light yellow darken-3 btn right sub-menu" data-content="blog.html">VIEW</a>' +
                '<a class="waves-effect waves-light blue darken-3 btn right sub-menu" data-content="blog.html">EDIT</a>' + 
                '<a class="waves-effect waves-light red darken-3 btn right sub-menu" data-content="blog.html">DELETE</a> &nbsp; </li>';

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
        let eventStartDate = document.getElementById('ds').value;
        let eventEndDate = document.getElementById('de').value;
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
                    status: isDraft ? false : true
                }
            },
            type: {
                blog: {
                    status: false,
                    type: 'N/A'
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
                    '<a class="waves-effect waves-light blue darken-3 btn right sub-menu" data-content="blog.html">EDIT</a>' + 
                    '<a class="waves-effect waves-light red darken-3 btn right sub-menu" data-content="blog.html">DELETE</a>' +
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

/** START OF HOME -- EVENT DYNAMIC LIST */
function createEventListElementOne(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s12 blog ' + blogId + '">' +
                '<div class="card small horizontal hoverable">' +
                    '<div class="card-image">' +
                        '<!-- <img src="assets/img/wtm.jpg" alt=""> -->' +
                    '</div>' +
                    '<div class="card-stacked semi-grey-text">' +
                        '<div class="card-content">' +
                            '<span class="card-title event-text" id="event-1-title"><b></b></span>' +
                            '<a href="#" class="left-align" id="event-1-time">Event time</a>&emsp;' +
                            '<a href="#" class="right-align" id="event-1-location">Event location</a>' +
                            '<p id="event-1-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>' +
                        '</div>' +
                        '<div class="card-action right-align">' +
                            '<a class="waves-effect waves-light red darken-2 btn">READ MORE</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('event-1');
    div.innerHTML += html;
    // Set values.
    document.getElementById('event-1-title').innerText = blogTitle;
    document.getElementById('event-1-time').innerText = blogTime;
    document.getElementById('event-1-location').innerText = blogLocation;
    document.getElementById('event-1-body').innerText = blogBody;

}

function createEventListElementTwo(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s6 blog ' + blogId + '">' +
            '<div class="card hoverable">' +
                '<div class="card-image">' +
                '</div>' +
                '<div class="card-content semi-grey-text">' +
                    '<span class="card-title event-text" id="event-2-title"><b></b></span>' +
                    '<a href="#" class="left-align" id="event-2-time">Event time</a>&emsp;' +
                    '<a href="#" class="right-align" id="event-2-location">Event location</a>' +
                    '<p id="event-2-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>' +
                '</div>' +
                '<div class="card-action right-align">' +
                    '<a class="waves-effect waves-light red darken-2 btn"> READ MORE </a>' +
                '</div>' +
            '</div>' +
        '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('event-2');
    div.innerHTML += html;
    // Set values.
    document.getElementById('event-2-title').innerText = blogTitle;
    document.getElementById('event-2-time').innerText = blogTime;
    document.getElementById('event-2-location').innerText = blogLocation;
    document.getElementById('event-2-body').innerText = blogBody;

}

function createEventListElementThree(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="card hoverable blog ' + blogId + '">' +
                    '<div class="card-content">' +
                        '<div class="card-image">' +
                        '</div>' +
                        '<div class="card-content semi-grey-text">' +
                            '<span class="card-title event-text" id="event-3-title"><b></b></span>' +
                            '<a href="#" class="left-align" id="event-3-time">Event time</a>&emsp;' +
                            '<a href="#" class="right-align" id="event-3-location">Event location</a>' +
                            '<p id="event-3-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>' +
                        '</div>' +
                        '<div class="card-action right-align">' +
                            '<a class="waves-effect waves-light red darken-2 btn"> READ MORE </a>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        let div = document.getElementById('event-3');
        div.innerHTML += html;
        // Set values.
        document.getElementById('event-3-title').innerText = blogTitle;
        document.getElementById('event-3-time').innerText = blogTime;
        document.getElementById('event-3-location').innerText = blogLocation;
        document.getElementById('event-3-body').innerText = blogBody;

}

function fetchEventListHome() {

    //let blogRef = firebase.database().ref('web').child('blog').limitToLast(1);
    let blogRef = firebase.database().ref('web').child('blog');

    blogRef.on('value', function(snapshot) {
        let ctr = 0;
        snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.val().type.event.status === true) {
                switch(ctr) {
                    case 0:
                    createEventListElementOne(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    case 1:
                    createEventListElementTwo(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    case 2:
                    createEventListElementThree(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    default:
                    break;
                }  
            } 
            console.log(childSnapshot.key);
            ctr++;
        });

    });

}
/** END OF HOME -- EVENT DYNAMIC LIST */

/** START OF HOME - BLOG DYNAMIC LIST */
function createBlogListElementOne(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s6 blog-col blog ' + blogId + '">' +
                    '<div class="card hoverable">' +
                        '<div class="card-content">' +
                            '<span class="card-title" id="blog-1-title">' +
                            '</span>' +
                            '<span class="grey-text"></span>' +
                            '<br><br><br>' +
                            '<p id="blog-1-body"></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('blog-1');
    div.innerHTML += html;
    // Set values.
    document.getElementById('blog-1-title').innerText = blogTitle;
    document.getElementById('blog-1-time').innerText = "Posted:&emsp;" + blogTime;
    //document.getElementById('blog-1-location').innerText = blogLocation;
    document.getElementById('blog-1-body').innerText = blogBody;

}

function createBlogListElemenTwo(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s6 blog-col blog ' + blogId + '">' +
                    '<div class="card hoverable">' +
                        '<div class="card-content">' +
                            '<span class="card-title" id="blog-1-title">' +
                            '</span>' +
                            '<span class="grey-text"></span>' +
                            '<br><br><br>' +
                            '<p id="blog-1-body"></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('blog-2');
    div.innerHTML += html;
    // Set values.
    document.getElementById('blog-2-title').innerText = blogTitle;
    document.getElementById('blog-2-time').innerText = "Posted:&emsp;" + blogTime;
    //document.getElementById('blog-1-location').innerText = blogLocation;
    document.getElementById('blog-2-body').innerText = blogBody;

}

function createBlogListElementThree(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s4 blog-col blog ' + blogId + '">' +
                    '<div class="card hoverable">' +
                        '<div class="card-content">' +
                            '<span class="card-title" id="blog-1-title">' +
                            '</span>' +
                            '<span class="grey-text"></span>' +
                            '<br><br><br>' +
                            '<p id="blog-1-body"></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('blog-3');
    div.innerHTML += html;
    // Set values.
    document.getElementById('blog-3-title').innerText = blogTitle;
    document.getElementById('blog-3-time').innerText = "Posted:&emsp;" + blogTime;
    //document.getElementById('blog-1-location').innerText = blogLocation;
    document.getElementById('blog-3-body').innerText = blogBody;

}

function createBlogListElementFour(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s4 blog-col blog ' + blogId + '">' +
                    '<div class="card hoverable">' +
                        '<div class="card-content">' +
                            '<span class="card-title" id="blog-1-title">' +
                            '</span>' +
                            '<span class="grey-text"></span>' +
                            '<br><br><br>' +
                            '<p id="blog-1-body"></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('blog-4');
    div.innerHTML += html;
    // Set values.
    document.getElementById('blog-4-title').innerText = blogTitle;
    document.getElementById('blog-4-time').innerText = "Posted:&emsp;" + blogTime;
    //document.getElementById('blog-1-location').innerText = blogLocation;
    document.getElementById('blog-4-body').innerText = blogBody;

}

function createBlogListElementFive(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s4 blog-col blog ' + blogId + '">' +
                    '<div class="card hoverable">' +
                        '<div class="card-content">' +
                            '<span class="card-title" id="blog-1-title">' +
                            '</span>' +
                            '<span class="grey-text"></span>' +
                            '<br><br><br>' +
                            '<p id="blog-1-body"></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('blog-5');
    div.innerHTML += html;
    // Set values.
    document.getElementById('blog-5-title').innerText = blogTitle;
    document.getElementById('blog-5-time').innerText = "Posted:&emsp;" + blogTime;
    //document.getElementById('blog-1-location').innerText = blogLocation;
    document.getElementById('blog-5-body').innerText = blogBody;

}

function createBlogListElementSix(blogId, blogTitle, blogTime, blogLocation,blogBody, ctr) {

    let html = '<div class="col s4 blog-col blog ' + blogId + '">' +
                    '<div class="card hoverable">' +
                        '<div class="card-content">' +
                            '<span class="card-title" id="blog-1-title">' +
                            '</span>' +
                            '<span class="grey-text"></span>' +
                            '<br><br><br>' +
                            '<p id="blog-1-body"></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    //READ MORE NOT WORKING
    let div = document.getElementById('blog-6');
    div.innerHTML += html;
    // Set values.
    document.getElementById('blog-6-title').innerText = blogTitle;
    document.getElementById('blog-6-time').innerText = "Posted:&emsp;" + blogTime;
    //document.getElementById('blog-1-location').innerText = blogLocation;
    document.getElementById('blog-6-body').innerText = blogBody;

}

function fetchBlogListHome() {

    //let blogRef = firebase.database().ref('web').child('blog').limitToLast(1);
    let blogRef = firebase.database().ref('web').child('blog');

    blogRef.on('value', function(snapshot) {
        let ctr = 0;
        snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.val().type.blog.status === true) {
                switch(ctr) {
                    case 0:
                    createBlogListElementOne(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    case 1:
                    createBlogListElementTwo(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    case 2:
                    createBlogListElementThree(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    case 3:
                    createBlogListElementFour(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    case 4:
                    createBlogListElementFive(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    case 5:
                    createBlogListElementSix(childSnapshot.key, childSnapshot.val().title, childSnapshot.val().type.event.date_start + "-" + childSnapshot.val().type.event.date_end, childSnapshot.val().type.event.location, childSnapshot.val().content, ctr);
                    break;

                    default:
                    break;
                }  
            } 
            console.log(childSnapshot.key);
            ctr++;
        });

    });

}
/** END OF HOME - BLOG DYNAMIC LIST */
function createMember() {

    let firstName = document.getElementById('firstname').value;
    let lastName = document.getElementById('lastname').value;
    let email = document.getElementById('email').value;
    let description = document.getElementById('description').value;
    let btnFile = document.getElementById('btnFile');

    
    let file = btnFile.files[0];

    let storageRef = firebase.storage().ref('img/' + file.name);

    storageRef.put(file);

    // task.on('state_changed',
    //     function progress(snapshot) {

    //     },

    //     function error(err) {

    //     },
        
    //     function complete(){

    //     }
        
    // );


    let newMemberKey = firebase.database().ref('web').child('member').push().key;
    let memberData = {
        id: newMemberKey,
        firstName: firstName,
        lastName: lastName,
        email: email,
        description: description,
        image: file.name,
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