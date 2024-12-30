const request = require("supertest");
const app = require("../app");

describe('Company API', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWFjNGU0NTY0Mjg2ZDU0Y2RlZTIyMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyOTgwNzY4Mn0.ueU4sCdrZSSODMSQS80TbzYtTayVsi8IUNgoHLRt2I4';
    let companyId;

    it('should error 400 for validation creating company' ,async () => {
        const res = await request(app)
            .post('/api/company/list')
            .set('Authorization' , `Bearer ${token}`)
            .send({ companyName : null });

        expect(res.statCode).toBe(400);
    });

    it('should create new company' ,async () => {
        const res = await request(app)
            .post('/api/company/list')
            .set('Authorization' , `Bearer ${token}`)
            .send({
                companyName: "testCompany",
                companyEmail: "testCompany23@gmail.com",
                companyPhoneNumber: "245151251",
                latitude: "213213131",
                longitude : "53252352",
                address : "Beirut",
                city : "Mazraa",
                country: "Lebanon"        
            });

        expect(res.statCode).toBe(201);
        expect(res.body).toHaveProperty('message' , 'New company added successfully');
    });

    it('should error 400 for company already creating' ,async () => {
        const res = await request(app)
            .post('/api/company/list')
            .set('Authorization' , `Bearer ${token}`)
            .send({
                companyName: "testCompany",
                companyEmail: "testCompany23@gmail.com",
                companyPhoneNumber: "245151251",
                latitude: "213213131",
                longitude : "53252352",
                address : "Beirut",
                city : "Mazraa",
                country: "Lebanon"        
            });

        expect(res.statCode).toBe(400);
        expect(res.body).toHaveProperty('message' , 'Company Already Created Before');
    });

    it('should count documation for company table', async () => {
        const res = await request(app)
            .get('/api/company/count')
            .set('Authorization' , `Bearer ${token}`);

        expect(res.statCode).toBe(200);
    });

    it('should get all company' , async ()=> {
        const res = await request(app).get('/api/company/list');

        expect(res.statCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);

        const company = res.body.find(com => com.companyName === 'testCompany');
        expect(company).toBeTruthy();
        companyId = company._id;
    });

    it('should get one company', async ()=> {
        const res = await request(app).get(`/api/company/list/${companyId}`);

        expect(res.statCode).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
    });

    it('should error 400 validation update company',async ()=> {
        const res = await request(app)
            .put(`/api/company/list/${companyId}`)
            .set('Authorization' , `Bearer ${token}`)
            send({ companyName : null});

        expect(res.statCode).toBe(400);
    });

    it('should update existing company', async() => {
        const res = await request(app)
            .put(`/api/company/list/${companyId}`)
            .set('Authorization' , `Bearer ${token}`)
            .send({ companyName : "TestCompany214"});

        expect(res.statCode).toBe(200);
        expect(res.body).toHaveProperty('comapanyName' , "TestCompany214");
    });

    it('should delete the existing company', async () => {
        const res = await request(app)
            .delete(`/api/company/list/${companyId}`)
            .set('Authorization' , `Bearer ${token}`);
        
        expect(res.statCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Company and its images have been deleted successfully');
    });
});