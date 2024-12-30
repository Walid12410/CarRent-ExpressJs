const request = require("supertest");
const app = require("../app");

describe('User API', () => {
    let adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWFjNGU0NTY0Mjg2ZDU0Y2RlZTIyMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyOTgwNzY4Mn0.ueU4sCdrZSSODMSQS80TbzYtTayVsi8IUNgoHLRt2I4';
    let userId;
    let token;

    it('should give the admin the user profile', async () => {
        const res = await request(app)
            .get(`/api/user/profile&pageNumber=1`)
            .set('Authorization' , `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        const user = res.body.find(user => user._id === userId);
        expect(user).toBeTruthy();
    });

    it('should count how many user (only admin)' , async () => {
        const res = await request(app)
           .get('/api/user/count')
           .set('Authorization' , `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });

    it('should error 400 for validation registor', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: null,
            });
        expect(res.statusCode).toEqual(400);
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'testuser',
                lastName: "lastNameTest",
                phoneNumber : "351513",
                email: 'testuser@example.com',
                password: 'password123'
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });


    it('should error 400 for same email user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'afrqrqr',
                lastName: "235tr1t",
                phoneNumber : "21`441",
                email: 'testuser@example.com',
                password: 'weaqwwa1531'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message' , 'User already exists');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        const user = res.body.find(user => user.email === 'testuser@example.com');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = user.token;
        userId = user._id;
    });

    it('should get user profile', async () => {
        const res = await request(app).get(`/api/user/profile/${userId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
    });

    it('should return 400 error for update', async () => {
        const res = await request(app)
            .put(`/api/user/profile/${userId}`)
            .set('Authorization' , `Bearer ${token}`)
            .send({firstName : null});
        // @TODO make the update validation 400 instead of 404 in controller
        expect(res.statusCode).toBe(400);
    });

    it('should update the existing user',async () => {
        const res = await request(app)
            .put(`/api/user/profile/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName : "Walid",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('firstName' , 'Walid');
    });
}); 