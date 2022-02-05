import { response } from "express"

const calculo = (msj) => {
  let d = {}
  for (let i = 0; i < msj; i++) {
      let n = Math.floor(Math.random() * 1000) + 1
      if (n in d)
        d[n] += 1
      else
        d[n] = 0
  }
  return d
}

process.on('exit', () => {
  console.log(`worker #${process.pid} cerrado`)
})


process.on('message', (msj) => {
  console.log(`worker #${process.pid} iniciando su tarea`)
  const result = calculo(msj)
  console.log(`worker #${process.pid} finalizó su trabajo`)
  process.send({result})
  process.exit()
})

process.send({isReady: true})
