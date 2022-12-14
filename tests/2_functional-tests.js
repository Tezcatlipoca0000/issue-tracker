const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { request } = require('chai');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);

  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
            assigned_to: 'Bob',
            status_text: 'chai tst1 status_text',
            issue_title: 'chai tst1 issue title',
            issue_text: 'chai tst1 issue text',
            created_by: 'Alice'
        })
        .end(function(err, res) {
            
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.isTrue(res.body.hasOwnProperty('_id'), 'res.body has _id property');
        });
        done();
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
            issue_title: 'chai tst2 issue title',
            issue_text: 'chai tst2 issue text',
            created_by: 'Chuck'
        })
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.include(res.body, {assigned_to: '', status_text: ''}, 'res.body has assigned_to & status_text properties set to empty string');
        });
        done();
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
            issue_text: 'chai tst3 issue text',
            created_by: 'chai tst3 created by'
        })
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.deepEqual(res.body, { error: 'required field(s) missing' }, 'res.body is {error: "required field(s) missing"}');
        });
        done();
  });

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .get('/api/issues/apitest')
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.isArray(res.body, 'res.body is an array');
        });
        done();
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .get('/api/issues/apitest')
        .query({created_by: 'Alice'})
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.isArray(res.body, 'res.body is an array');
            res.body.forEach(n => {
                assert.propertyVal(n, 'created_by', 'Alice', 'every obj in here has "created_by" set to "Alice"');
            });
        });
        done();
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .get('/api/issues/apitest')
        .query({created_by: 'Alice', assigned_to: 'Bob'})
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.isArray(res.body, 'res.body is an array');
            res.body.forEach(n => {
                assert.propertyVal(n, 'created_by', 'Alice', 'every obj in here has "created_by" set to "Alice"');
                assert.propertyVal(n, 'assigned_to', 'Bob', 'every obj in here has "assigned_to" set to "Bob"');
            });
        });
        done();
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
            issue_title: 'chai tst7 issue title',
            issue_text: 'chai tst7 issue text',
            created_by: 'Dave'
        })
        .end(function(erro, resp) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    _id: resp.body._id,
                    assigned_to: 'Yadira',
                })
                .end(function(err, res) {
                    assert.isNull(err, 'There was no error');
                    assert.equal(res.status, 200, 'res.status is equal to 200');
                    assert.property(res.body, 'result', 'response is result');
                });
                done();
        });
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
            issue_title: 'chai tst8 issue title',
            issue_text: 'chai tst8 issue text',
            created_by: 'Dave'
        })
        .end(function(erro, resp) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    _id: resp.body._id,
                    assigned_to: 'Yadira',
                    status_text: 'updated status',
                    open: 'false',
                    issue_title: 'updated title',
                    issue_text: 'updated text',
                    created_by: 'Zelda',
                })
                .end(function(err, res) {
                    assert.isNull(err, 'There was no error');
                    assert.equal(res.status, 200, 'res.status is equal to 200');
                    assert.property(res.body, 'result', 'response is result');
                });
                done();
        });
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .put('/api/issues/apitest')
        .type('form')
        .send({
            status_text: 'updated status'
        })
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.propertyVal(res.body, 'error', 'missing _id', 'response is error: missing _id');
        });
        done();
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
            issue_title: 'chai tst10 issue title',
            issue_text: 'chai tst10 issue text',
            created_by: 'Ed'
        })
        .end(function(erro, resp) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    _id: resp.body._id
                })
                .end(function(err, res) {
                    assert.isNull(err, 'There was no error');
                    assert.equal(res.status, 200, 'res.status is equal to 200');
                    assert.propertyVal(res.body, 'error', 'no update field(s) sent', 'response is error: no update field(s) sent');
                });
                done();
        });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .put('/api/issues/apitest')
        .type('form')
        .send({
            _id: '052f3e0c6dd6bf1e02cb9e',
            assigned_to: 'Yadira',
            status_text: 'updated status',
            open: 'false',
            issue_title: 'updated title',
            issue_text: 'updated text',
            created_by: 'Zelda',
        })
        .end(function(err, res) {
            assert.isNull(err, 'There was no error');
            assert.equal(res.status, 200, 'res.status is equal to 200');
            assert.propertyVal(res.body, 'error', 'could not update', 'response is error: could not update');
        });
        done();
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
            issue_title: 'chai tst12 issue title',
            issue_text: 'chai tst12 issue text',
            created_by: 'Fred'
        })
        .end(function(erro, resp) {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                //.type('form')
                .send({
                    _id: resp.body._id
                })
                .end(function(err, res) {
                    assert.isNull(err, 'There was no error');
                    assert.equal(res.status, 200, 'res.status is equal to 200');
                    assert.propertyVal(res.body, 'result', 'successfully deleted', 'response is result: successfully deleted');
                });
                done();
         });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({_id: '052f3e0c6dd6bf1e02cb9e'})
            .end(function(err, res) {
                assert.isNull(err, 'There was no error');
                assert.equal(res.status, 200, 'res.status is equal to 200');
                assert.propertyVal(res.body, 'error', 'could not delete', 'response is error: could not delete');
            });
            done();
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({_id: ''})
            .end(function(err, res) {
                assert.isNull(err, 'There was no error');
                assert.equal(res.status, 200, 'res.status is equal to 200');
                assert.propertyVal(res.body, 'error', 'missing _id', 'response is error: missing _id');
            });
            done();
    });

});