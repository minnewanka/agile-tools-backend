import chai from "chai"
import chaiHttp from "chai-http"
import Parse from 'parse/node'
import api from '../app'

chai.use(chaiHttp)
let should = chai.should()
process.env.NODE_ENV = "test"

/*
  * Test the /GET route
  */
describe("/GET Room", () => {
    it("should respond 200", done => {
        chai
            .request(Parse.serverURL)
            .get("/classes/Room")
            .set('X-Parse-Application-Id', 'SIIAG')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

/*
* Test the /POST route
*/
describe("/POST room", () => {
    it("should CREATE a room", done => {
        const room = {
            name: "Test name"
        }
        chai
            .request(Parse.serverURL)
            .post("/classes/Room")
            .set('X-Parse-Application-Id', 'SIIAG')
            .set('Content-Type', 'application/json')
            .send(room)
            .end((err, res) => {
                res.should.have.status(201)
                res.body.code.should.be.not.empty
                done()
            })
    })
})