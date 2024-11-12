import inquirer from 'inquirer';
import SteamUser from 'steam-user';
import GlobalOffensive from 'globaloffensive';

let user = new SteamUser();
let csgo = new GlobalOffensive(user);
let SuccessfullyLoggedIn = false;

const questions = [
    {
        type: 'input',
        name: 'name',
        name: 'accountName',
        message: "Enter your Steam account name:",
    },
    {
        type: 'password',
        name: 'password',
        message: "Enter your Steam account password:",
        mask: '*',
    }
];

// function for steam log-in process
function login(accountName, password) {
    console.log('Attempting to log in...');
    console.log('NOTE: Manual input of Steam Guard Code is needed, approving the login from the Steam App will not work.');
    
    user.on('loggedOn', () => {
        console.log('Successfully logged into Steam');
        SuccessfullyLoggedIn = true;
        startCSGOActions(); // run rest of program after successful login
    });

    user.on('error', (err) => {
        if (err.eresult === 5) {
            console.log('Invalid Username or Password. Please try again.');
            promptForLogin(); // retry login process if password or username is incorrect
        } else {
            console.error('Error logging into Steam:', err);
        }
    });

    user.logOn({
        accountName,
        password,
        machineName: "Storage Unit Manager",
    });
}

// function to prompt for steam login
function promptForLogin() {
    inquirer.prompt(questions).then(answers => {
        login(answers.accountName, answers.password);
    });
}

function startCSGOActions() {
    //runs after successful login

}



promptForLogin();