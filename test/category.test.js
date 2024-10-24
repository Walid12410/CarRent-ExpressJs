const request = require("supertest");
const app = require("../app");

describe('Category API', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWFjNGU0NTY0Mjg2ZDU0Y2RlZTIyMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyOTgwNzY4Mn0.ueU4sCdrZSSODMSQS80TbzYtTayVsi8IUNgoHLRt2I4';
    let categoryId;

    it('should create a new category', async () => {
        const res = await request(app)
            .post('/api/category')
            .set('Authorization', `Bearer ${token}`)
            .send({ categoryName: 'New Category' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'New Category Added Successfully');
    });

    it('should get all categories and extract the ID of New Category', async () => {
        const res = await request(app).get('/api/category');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);

        const category = res.body.find(cat => cat.categoryName === 'New Category');
        expect(category).toBeTruthy();
        categoryId = category._id;
    });

    it('should update the existing category', async () => {
        const res = await request(app)
            .put(`/api/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ categoryName: 'Updated Category' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('categoryName', 'Updated Category');
    });

    it('should delete the category', async () => {
        const res = await request(app)
            .delete(`/api/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Category has been deleted successfully');
    });
});
