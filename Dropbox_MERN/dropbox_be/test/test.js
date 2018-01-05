var assert = require('assert');
var app = require('../app');
var request = require('supertest');
var assert = require('chai').assert;
var token='';
var email=Math.random()+'@gmail.com';

//Test case- 0 - register
it('Test case 0 - should respond with success flag on', function(done) {
    request(app)
      .post('/register')
      .send({"email":email,
    	  "password":"admin",
    	  "firstName":"admin",
    	  "lastName":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.body.success, true);
          done();
      });
 });

//Test case- 1 - login
it('Test case 1 - should respond with success flag on', function(done) {
	  request(app)
      .post('/login')
      .send({"email":email,
    	  "password":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
            if (err) done(err);
            token=res.body.token;
            assert.equal(res.body.success, true);
            done();
      });
 });

//Test case- 2 - getFileList
it('Test case 2 - should respond with file list and success flag on', function(done) {
    request(app)
      .get('/getFileList?userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 3 - getGroupList
it('Test case 3 - should respond with group list and success flag on', function(done) {
    request(app)
      .get('/getGroupList?userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 4 - getSharedFileList
it('Test case 4 - should respond with shared file list and success flag on', function(done) {
    request(app)
      .get('/getSharedFileList?userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 5 - getStarredList
it('Test case 5 - should respond with shared file list and success flag on', function(done) {
    request(app)
      .get('/getStarredList?userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 6 - getRecentFileList
it('Test case 6 - should respond with recent file list and success flag on', function(done) {
    request(app)
      .get('/getRecentFileList?userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 7 - getUser
it('Test case 7 - should respond with user data and success flag on', function(done) {
    request(app)
      .get('/getRecentFileList?userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 8 - createFolder
it('Test case 8 - should respond with success message and success flag on', function(done) {
    request(app)
      .get('/createFolder?parentFolder=1&newFolder=a&userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 9 - fetchActivity
it('Test case 9 - should respond with user activity and success flag on', function(done) {
    request(app)
      .get('/fetchActivity?userId=1&token='+token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });

//Test case- 10 - update user data
it('Test case 10 - should respond with success message and success flag on', function(done) {
    request(app)
      .post('/updateUserData?userId=1&token='+token)
      .send({"interest":"classical music"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        assert.equal(res.body.success, true);
        done();
      });
 });