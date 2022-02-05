import FirebaseContainer from "../../containers/FirebaseContainer.js";

class DaoMessageFirebase extends FirebaseContainer {
  constructor(conn, collection) {
    super(conn, collection)
  }
}

export default DaoMessageFirebase