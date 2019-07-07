const OrbotClient = require('./orbotClient.js')
require('dotenv').config()
const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
const { colorize, combine, printf } = format
const moment = require('moment')
const path = require('path')
const util = require('util')
const resolve = (str) => path.join('src', str)

const logFormat = printf((info) => {
  return `[${chalk.grey(moment().format('hh:mm:ss'))}] ${info.level}: ${info.message}`
})

const logger = createLogger({
  level: 'silly',
  format: combine(
    colorize(),
    logFormat
  ),
  transports: [new transports.Console()]
})

const orbot = new OrbotClient({
  token: process.env.TOKEN,
  modules: resolve('modules'),
  disableEveryone: false,
  autoreconnect: true
})

orbot.unregister('middleware', true)
orbot.unregister('logger', 'console')
orbot.register('logger', 'winston', logger)
orbot.register('middleware', resolve('middleware'))
logger.error(new Error('Error test'))
const commands = resolve('commands')
orbot.register('commands', commands, {
  groupedCommands: true
})
orbot.on('commander:registered', logger.log)

orbot.on('ready', () => {
  const users = orbot.users.size

  /*
    * 0 = Playing
    * 1 = Twitch
    * 2 = Listening to
    * 3 = Watching
    */

  const statuses = [
    { type: 3, name: 'the OrsTac server' },
    { type: 3, name: `${users} users` }
  ]

  orbot.changeStatus = () => {
    let type
    const cstat = statuses[~~(Math.random() * statuses.length)]
    if (cstat.type === 0) type = 'Playing'
    if (cstat.type === 2) type = 'Listening'
    if (cstat.type === 3) type = 'Watching'
    orbot.editStatus({ name: cstat.name, type: cstat.type || 0 })
    logger.info(chalk.yellow.bold(`Status changed: '${type} ${cstat.name}'`))
  }

  setInterval(() => orbot.changeStatus(), 120000)
  logger.info(`Logged in as ${orbot.user.username}`)
})

orbot.run()

process.on('SIGINT', function () {
  logger.info('SIGINT detected.')
  process.exit(0)
})

process.on('unhandledRejection', (reason, promise) => {
  if (typeof reason === 'undefined') return
  logger.error(`Unhandled rejection: ${reason} - ${util.inspect(promise)}`)
})
