import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { loadContent, saveContent, listFiles } from './routes';



describe('routes', function() {


  it('saveContent', function() {
    // Successful save
    const req = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveContent?name=file', body: {content: 'some square'}});
    const res = httpMocks.createResponse();
    saveContent(req, res)
    assert.strictEqual(res._getStatusCode(), 200);
    assert.strictEqual(res._getData(), 'Content saved for file: file');
    
    // Successful Save 2
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveContent?name=file2', body: {content: 'some square2'}});
    const res1 = httpMocks.createResponse();
    saveContent(req1, res1)
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.strictEqual(res1._getData(), 'Content saved for file: file2');
  })

  it('loadContent', function() {
    // Successful load
    const req = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadContent?name=file'});
    const res = httpMocks.createResponse();
    loadContent(req, res)
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {name: 'file', content: 'some square'});

    // Successful load 2
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadContent?name=file2'});
    const res1 = httpMocks.createResponse();
    loadContent(req1, res1)
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {name: 'file2', content: 'some square2'});
  })

  it('listFiles', function() {
    // Successful list files
    const req = httpMocks.createRequest(
      {method: 'GET', url: '/api/listFiles'});
    const res = httpMocks.createResponse();
    listFiles(req, res)
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {keys: ['file', 'file2']});

    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveContent?name=file3', body: {content: 'some square'}});
    const res2 = httpMocks.createResponse();
    saveContent(req2, res2)
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/listFiles'});
    const res3 = httpMocks.createResponse();
    listFiles(req3, res3)
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {keys: ['file', 'file2','file3']});
  })

});
