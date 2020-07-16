const HTTP = new XMLHttpRequest();
// const URL = "http://127.0.0.1:5000/auth/"
const URL = "https://locate-helper.herokuapp.com/auth/"


function updateHiddenMessage() {
    let messageEle = document.getElementById("hiddenMessage");
    messageEle.style.visibility = 'visible';
    messageEle.style.opacity = "1";
    messageEle.style.transition = "opacity 1s linear";
}


function authenticate(username, password) {
    HTTP.open('GET',`${URL}${username}/${password}`);
    HTTP.send();

    HTTP.onreadystatechange=(e)=> {
        if(HTTP.responseText == "good") {
            console.log('GOOD TO GO');
            let url = 'tickethelper.html';
            window.location.href = url;
        } else {
            console.log('NOPE');
            // alert('Credentials invalid. Please try again.');
            updateHiddenMessage();
        }
    }

}


function buttonCommand() {
    let username = document.getElementById("usernameInput").value;
    let password = document.getElementById("passwordInput").value;

    if(username.length === 0) {
        alert('Please enter a username.');
        return;
    }
    if(password.length === 0) {
        alert('Please enter a password.');
        return;
    } 

    authenticate(username, password);

}