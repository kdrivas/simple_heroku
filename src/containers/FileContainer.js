import fs from 'fs'

class FileContainer {
  constructor(init) {
    this.nameFile = init
    if (!fs.existsSync(init))
      fs.writeFileSync(init, JSON.stringify([]))
  }

  assignId(data) {
    if (data.length)
      return Math.max(...data.map(e => e.id)) + 1
    else
      return 1
  }

  async getAll() {
    try {
      const text = await fs.promises.readFile(this.nameFile, 'utf8')
      const data = JSON.parse(text)
      return data
    } catch (e) {
      console.log(e)
    }
  }

  async add(element) {
    try {
      const text = await fs.promises.readFile(this.nameFile, 'utf8')
      const data = JSON.parse(text)
      element['id'] = this.assignId(data)
      data.push(element)
      await fs.promises.writeFile(this.nameFile, JSON.stringify(data, null, 2))
      return element
    } catch(e) {
      console.log(e)
    }
  }

  async remove(id) {
    try {
      const text = await fs.promises.readFile(this.nameFile, 'utf8')
      const data = JSON.parse(text)    
      const index = data.findIndex(e => e.id == id)
      if (index >= 0) {
        data.splice(index, 1)
        await fs.promises.writeFile(this.nameFile, JSON.stringify(data, null, 2))
        return 1
      }
      else
        return 0
    } catch(e) {
      console.log(e)
    }
  }

  async update(id, element) {
    try {
      const text = await fs.promises.readFile(this.nameFile, 'utf8')
      const data = JSON.parse(text)    
      const index = data.findIndex(e => e.id == id)
      if (index >= 0){
        data[index] = {...data[index], ...element}
        await fs.promises.writeFile(this.nameFile, JSON.stringify(data, null, 2))
        return 1
      }
      else
        return 0
    } catch(e) {
      console.log(e)
    }
  }

  async findById(id){
    try {
      const text = await fs.promises.readFile(this.nameFile, 'utf8')
      const data = JSON.parse(text)    
      const index = data.findIndex(e => e.id == id)
      if (index >= 0){
        return data[index]
      }
      else
        return null
    } catch(e) {
      console.log(e)
    }
  }
}

export default FileContainer