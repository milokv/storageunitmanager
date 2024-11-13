import inquirer from 'inquirer';
import SteamUser from 'steam-user';
import GlobalOffensive from 'globaloffensive';
import fs from 'fs';

let user = new SteamUser();
let csgo = new GlobalOffensive(user);

// load json files with weapon + skin ids
const skinsData = JSON.parse(fs.readFileSync('skinlist.json', 'utf8'));
const weaponsData = JSON.parse(fs.readFileSync('weaponlist.json', 'utf8'));

// reverse json format for easy lookup (cant be bothered to reverse everything rn)
const skins = Object.fromEntries(Object.entries(skinsData).map(([name, index]) => [index, name]));
const weapons = Object.fromEntries(Object.entries(weaponsData).map(([name, index]) => [index, name]));

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
        startCSActions(); // run rest of program after successful login
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

function startCSActions() {
    //runs after successful login
    csgo.on('connectedToGC', () => {
        console.log('Connected to CS2 Game Coordinator');
        convertInventory(csgo.inventory);
    });

    user.gamesPlayed([730]); // start CS2 (App ID 730)
}

// function to convert inventory data to readable skin format.
function convertInventory(inventory) {
    inventory.forEach(item => {
        const weaponName = weapons[item.def_index] || 'Unknown Weapon';
        const skinName = skins[item.paint_index] || 'Unknown Skin';

        console.log(`ID: ${item.id}`);
        console.log(`Weapon Name: ${weaponName}`);
        console.log(`Skin Name: ${skinName}`);
        console.log('---');
    });
}


promptForLogin();