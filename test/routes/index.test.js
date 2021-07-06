process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');

const { expect } = chai;

chai.use(chaiHttp);
describe('GET /api/v1/', () => {
  it('should return the root page', async () => chai.request(server)
    .get('/api/v1')
    .then((res) => {
      expect(res).to.have.status(200);
      // expect(res).to.be.json; // eslint-disable-line
      // expect(res.body).to.have.property('user');
      // expect(res.body.user).to.have.property('name');

      // expect(res.body.user.name).to.equal('Foo Springs');
    })
    .catch((err) => {
      console.error('error thrown: ', err);
      throw err;
    }));
});
