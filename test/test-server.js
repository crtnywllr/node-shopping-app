var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;
var testItem; // <= this is to store the value of your get 

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });
it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                testItem = res.body[0]; // this will store the value for use later
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
        // the string in .put doesn't matter because your using the id from .send(). 
        .put('/items/testItem._id') // so here, you want to pass testItem.id instead of a number
        .send({name:"Beans", id: testItem._id}) // and the same here. 
        .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
        done();
        });
    });
    it('should show the edited item on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                testItem = res.body[3];
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(4);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                res.body[3].name.should.equal('Kale');
                done();
            });
    });
    
    it('should return an error if the id to edit entered isn\'t a number', function(done){
         chai.request(app)
        .put('/items/pickle') 
        .send({name:"Pickles", id: 0}) 
        .end(function(err, res){
                res.should.have.status(400);
        done();
        });
    });
    
    it('should delete an item on delete', function(done) {
        
        chai.request(app)
        .delete('/items/' + testItem._id) // this should be a variable, will need to do a concatenation 
        .end(function(err, res) {
             res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body.name.should.equal("Kale");
                done();
    });
    });
    
       it('should have one less item on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });

    it('should return an error if the id to delete that is entered isn\'t a number', function(done) {
         chai.request(app)
        .delete('/items/pickle') 
        .end(function(err, res){
                res.should.have.status(400);
        done();
    });
    });
    
    it('should return an error if the id to delete doesn\'t exist', function(done) {
           chai.request(app)
        .delete('/items/9') 
        .end(function(err, res){
                res.should.have.status(400);
        done();
    });
    });


   
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});