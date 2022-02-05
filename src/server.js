import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bCrypt from 'bcrypt'
import session from 'express-session'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url';
import os from 'os';
import cluster from 'cluster';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import myLogger from './logger.js';

const argv = yargs(hideBin(process.argv)).default({
  modo: 'FORK',
  puerto: 8080
})
.argv

const numCPUs = os.cpus().length

if (argv.modo == 'CLUSTER' && cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', worker => {
      console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
      cluster.fork()
  })
}
else {
  const app = express()
  const httpServer = HttpServer(app)
  const io = new IOServer(httpServer)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const createHash = password => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
  }

  const isValidPass =  (user, password) => {
    return bCrypt.compareSync(password, user.password)
  }

  passport.use(
    'signup',
    new LocalStrategy({
      passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ username }, function (err, user) {
        if (err) {
          console.log('Error in SignUp: ' + err)
          return done(err)
        }

        if (user) {
          console.log('User already exists')
          return done(null, false)
        }

        const newUser = {
          username,
          password: createHash(password)
        }

        // User.create(newUser, (err, userWithId) => {
        //   if (err) {
        //     console.log('Error in Saving user: ' + err)
        //     return done(err)
        //   }
        //   console.log(user)
          
        //   return done(null, userWithId)
        // })
      })
    })
  )

  passport.use('signin', 
    new LocalStrategy((username, password, done) => {
      // User.findOne({ username }, (err, user) => {
      //   if (err) 
      //     return done(err)
        
      //   if (!isValidPass(user, password)) {
      //     console.log('User not found')
      //     return done(null, false)
      //   }

      //   return done(null, user)
      // })
    })
  )

  passport.deserializeUser((id, done) => {
    // User.findById(id, done)
  })

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  const loggerMiddleware = (req, res, next) => {
    myLogger.info(`Receiving a ${req.method} req with url ${req.originalUrl}`)
    next()
  }


  app.use('/', express.static('public'))
  app.use(express.urlencoded({ extended: true }))
  app.use(loggerMiddleware)
  app.use(
    session({
      secret: 'hola',
      cookie: {
        maxAge: 60000
      },
      saveUninitialized: false,
      resave: true
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.json({'message': 'error'});
  };

  app.get('/login', (req, res) => {
    res.redirect('/login.html')
  })

  app.get('/register', (req, res) => {
    console.log(process.env.DB_OPTION)
    res.redirect('/register.html')
  })

  app.get('/checkAuth', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({'message': 'ok'})
    } else {
      res.json({'message': 'error'})
    }
  })

  app.get('/info', (req, res) => {
    res.json({
      'argv': process.argv,
      'platform': process.platform,
      'version': process.version,
      'memoryUsage': process.memoryUsage.rss(),
      'execPath': process.execPath,
      'processId': process.pid,
      'folder': process.cwd(),
      'cpus': numCPUs,
    })
  })

  app.get('/messages', checkAuth, (req, res) => {
    res.redirect('/messages.html')
  })

  app.post('/signup', passport.authenticate('signup', { failureRedirect: '/error_login.html', successRedirect: '/messages'}), (req, res) => {
    res.status(200).json({'message': 'ok'})
  })

  app.post('/signin', passport.authenticate('signin', { failureRedirect: '/error_auth.html', successRedirect: '/messages'}), (req, res) => {
    res.status(200).json({'message': 'ok'})
  })

  app.get('/failaccess', (req, res) => {
    res.status(400).json({'message': 'error'})
  })

  app.get('/getUser', (req, res) => {
    if (req.user?.username) {
      res.json(req.user.username)
    } else {
      res.json({'message': 'error'})
    }
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.json({'message': 'ok'})
  })

  app.get('*', (req, res) => {
    myLogger.warn(`Url ${req.originalUrl} with method ${req.method} not exists`)

    res.json({'message': 'Not exist or authorized'})
  })

  const port = argv.port || 8080
  const server = httpServer.listen(port, () => {
    console.log(`listening at port ${port} with process ${process.pid}`)
  })

  server.on('error', error => console.log(error))
}