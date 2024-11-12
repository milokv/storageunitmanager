const SteamUser = require('steam-user');
const GlobalOffensive = require('globaloffensive');
require('dotenv').config();

let user = new SteamUser();
let csgo = new GlobalOffensive(user);