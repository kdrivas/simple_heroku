import winston from 'winston'

const myLogger = winston.createLogger({
  transports: [
    new winston.transports.File({filename: 'warn.log', level: 'warn'}),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.Console({level: 'info'})
  ]
})

export default myLogger