import admin from "firebase-admin"

class FirebaseContainer {
  constructor(conn, collection) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(conn)
      })
    }

    this.db = admin.firestore()
    this.model = this.db.collection(collection)
  }

  getObj(doc) {
    return { id: doc.id, ...doc.data() }
  }

  async getAll() {
    try {
      const result = []
      const payload = await this.model.get()
      payload.forEach(doc => result.push(this.getObj(doc)))
      return result
    } catch (e) {
      console.log(e)
    }
  }

  async add(element) {
    try {
      const result = await this.model.add(element)
      element['id'] = result.id
      return element
    } catch(e) {
      console.log(e)
    }
  }

  async remove(id) {
    try {
      const docRef = await this.model.doc(id).get()
      if (docRef.exists) {
        await this.model.doc(id).delete()
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
      const doc = await this.model.doc(id).get()
      if (doc.exists){
        await this.model.doc(id).set(element);
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
      const doc = await this.model.doc(id).get()
      if (doc.exists)
        return this.getObj(doc)
      else
        return 0
    } catch(e) {
      console.log(e)
    }
  }
}

export default FirebaseContainer