const request = require('supertest');
const app = require('../app');  // Your Express app

describe('GET /files/:id/data', () => {
  it('should return the file content when the file exists and is public', async () => {
    const res = await request(app)
      .get('/files/5f1e879ec7ba06511e683b22/data')
      .set('X-Token', 'f21fb953-16f9-46ed-8d9c-84c6450ec80f');
      
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello Webstack!');
  });

  it('should return 404 when the file is not found', async () => {
    const res = await request(app)
      .get('/files/nonexistent-id/data')
      .set('X-Token', 'f21fb953-16f9-46ed-8d9c-84c6450ec80f');
      
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found');
  });

  // Additional tests for other scenarios can be added
});

