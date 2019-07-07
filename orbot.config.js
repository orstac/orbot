module.exports = {
  apps: [{
    name: 'orbot',
    script: 'src/orbot.js',
    exec_mode: 'cluster',
    instances: 1,
    watch: false,
    autorestart: true,
    output: './logs/orbot/output.log',
    error: './logs/orbot/error.log'
  }]
}