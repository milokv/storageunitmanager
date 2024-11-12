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

inquirer.prompt(questions).then(answers => {
    console.log(`Name and password entered successfully.`);
    console.log('Logging in...');

    // Set up event listeners
    user.on('loggedOn', () => {
        console.log('Successfully logged into Steam');
        SuccessfullyLoggedIn = true;
    });

    user.on('error', (err) => {
        if (err.eresult == 5) {
            console.log('Invalid Username or Password')
        } else {
            console.error('Error logging into Steam:', err);
        }
    });

    // Attempt to log in
    user.logOn({
        accountName: answers.accountName,
        password: answers.password,
        machineName: "Storage Unit Manager",
    });
});
