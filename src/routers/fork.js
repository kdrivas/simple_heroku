import { Router } from "express";
import { fork } from 'child_process'

const randomRouter = Router()

randomRouter.get('/randoms', (req, res, next) => {
  const {number} = req.query
  const forked = fork('src/routers/computo.js')
  forked.on('message', (msj) => {
      if (msj.isReady) {
        forked.send(number ?? 100000000)
      } else {
        console.log('results')
        res.json({'results': msj.result})
      }
  })
})

export default randomRouter;