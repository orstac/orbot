const { Client } = require('sylphy')
const yaml = require('js-yaml')
const fs = require('file-system')
const emotes = yaml.safeLoad(fs.readFileSync('./src/lang/emotes.yml', 'utf8'))

class orbot extends Client {
  constructor (options = {}) {
    super(options)
    this.success = emotes.success
    this.question = emotes.question
    this.deny = emotes.deny
  }
}

module.exports = orbot
