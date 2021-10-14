const Discord = require('discord.js')
const { readdirSync } = require('fs')
const mysql = require('mysql')
const chalk = require('chalk')
const forEach = require('lodash');
const conf = require('./config.json')
const client = new Discord.Client({intents: 32767})
const commands = new Discord.Collection()
const cooldowns = new Discord.Collection()


// Handlers

const loadCommands = (dir = "./commandes/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'))

        for (const file of commands) {
            const getFileName = require(`${dir}/${dirs}/${file}`)
            client.commands.set(getFileName.help.name, getFileName) 
            console.log(chalk.blue.italic(`Commandes lancées: ${getFileName.help.name}, aliases: ${getFileName.help.aliases}`))
        }
    })
}

const loadEvents = (dir = './evenements/') => {
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"))

        for (const event of events) {
            const evt = require(`./${dir}/${dirs}/${event}`)
            const evtName = event.split(".")[0]
            client.on(evtName, evt.bind(null, client))
            console.log(chalk.red.italic(`Evenement chargé: ${evtName}`))
        }
    })
}

loadCommands();
loadEvents();

client.login(conf.connexion)
