const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);

  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/:project')
        .type('form')
        .send({
            assigned_to: 'chai tst1 asigned_to',
            status_text: 'chai tst1 status_text',
            issue_title: 'chai tst1 issue title',
            issue_text: 'chai tst1 issue text',
            created_by: 'chai tst1 created by'
        })
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.isTrue(res.body.hasOwnProperty('_id'), 'res.body has _id property');
        });
        done();
  });

});
