const HTTP = new XMLHttpRequest();
// const URL = "http://127.0.0.1:5000/auth/"
const URL = "https://locate-helper.herokuapp.com/auth/"

function smallScreenStuff() {
    console.log(window.screen.width);
    if(window.screen.width < 550) {
        console.log('this happens')
        let formContainer = document.getElementById('formContainer');
        formContainer.style.width = "100%";
        formContainer.style.height = "auto";
        formContainer.style.marginLeft = "10%";

        let formEle = document.getElementById("form");
        formEle.style.maxWidth = "100%";
        formEle.style.width = "70%";
        formEle.style.height = "50%";

        let usernameLabel = document.getElementById("usernameLabel");
        usernameLabel.style.fontSize = "2.5rem";
        usernameLabel.style.marginLeft = "2ch";
        
        let passwordLabel = document.getElementById("passwordLabel");
        passwordLabel.style.fontSize = "2.5rem";
        passwordLabel.style.marginLeft = "2ch";

        let usernameInput = document.getElementById("usernameInput");
        usernameInput.style.maxWidth = "100%";

        usernameLabel.style.margin = "5vw";
        usernameInput.style.margin = "5vw";
        usernameLabel.style.marginLeft = ".5ch";
        usernameInput.style.marginLeft = "1ch";
        usernameLabel.style.marginBottom = "-2vh";
        usernameInput.style.marginBottom = "-2vh";
        usernameLabel.style.height = "7.5ch";
        usernameInput.style.height = "7.5ch";

        let passwordInput = document.getElementById("passwordInput");

        passwordInput.style.maxWidth = "100%";

        passwordInput.style.height = "7.5ch";
        passwordLabel.style.height = "7.5ch";
        // passwordInput.style.width = "500ch";


        passwordLabel.style.margin = "5vw";
        passwordInput.style.margin = "5vw";
        passwordLabel.style.marginLeft = ".5ch";
        passwordInput.style.marginLeft = "1ch";
        passwordLabel.style.marginTop = "0px";
        passwordInput.style.marginTop = "0px";
        

        let loginButton = document.getElementById("loginButton");
        // loginButton.style.fontSize = "5ch";
        loginButton.style.left = "0ch";

        let hiddenMessage = document.getElementById("hiddenMessage");
        hiddenMessage.style.marginRight = "0ch";
        hiddenMessage.style.fontSize = "3rem";

        let warningMessage = document.getElementById("warning");
        warningMessage.style.marginRight = "0ch";
        warningMessage.style.marginTop = "0px";
        warningMessage.style.width = "80%";
        warningMessage.style.fontSize = "3rem";

    }
}


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

smallScreenStuff();