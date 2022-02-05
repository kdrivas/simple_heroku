
   
import DaoMessageFile from "./FileDAO.js";
import DaoMessageFirebase from "./FirebaseDAO.js";
import DaoMessageMongo from "./MongoDAO.js";

import { bdType, configBD } from "../../config.js";

let DaoMessage
console.log('bdtype', bdType)
if (bdType == 'FILE')
  DaoMessage = new DaoMessageFile(configBD['FILE'] + 'messages.json')
else if (bdType == 'MONGO'){
  console.log('mongo', configBD['MONGO'])
  const messageSchema = new mongoose.Schema({
    id: { type: String }, 
    message: { type: String }, 
    author: { type: Object }
  })

  const messageModel = mongoose.model('Product', messageSchema)

  DaoMessage = new DaoMessageMongo(configBD['MONGO'], messageModel)
}
else if (bdType == 'FIREBASE')
  DaoMessage = new DaoMessageFirebase(configBD['FIREBASE'], 'messages')

export default DaoMessage