import MongoContainer from "../../containers/MongoContainer.js";

class DaoMessageMongo extends MongoContainer {
  constructor(conn, collection) {
    super(conn, collection)
  }
}

export default DaoMessageMongo