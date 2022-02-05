import mongoose from "mongoose"

class MongoContainer {
  constructor(conn, model) {
    this.conn = conn
    this.model = model
  }

  async init() {
    await mongoose.connect(this.conn, {
      serverSelectionTimeoutMS: 5000,
    })
  }

  async getAll() {
    try {
      const result = await this.model.find({})
      return result
    } catch (e) {
      console.log(e)
    }
  }

  async add(element) {
    try {
      const result = await this.model.create(element)
      return result
    } catch(e) {
      console.log(e)
    }
  }

  async remove(id) {
    try {
      const result = await this.model.deleteMany({ _id: id})
      return result['deletedCount']
    } catch(e) {
      console.log(e)
    }
  }

  async update(id, element) {
    try {
      const result = await this.model.updateOne({ _id : id }, { $set: element })
      return result['matchedCount']
    } catch(e) {
      console.log(e)
    }
  }

  async findById(id){
    try {
      const result = await this.model.findOne({ _id: id })
      return result
    } catch(e) {
      console.log(e)
    }
  }
}

export default MongoContainer