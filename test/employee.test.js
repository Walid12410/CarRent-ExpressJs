const request = require("supertest");
const app = require("../app");
const { Companies } = require("../model/Company");


describe('Emoployee API', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWFjNGU0NTY0Mjg2ZDU0Y2RlZTIyMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyOTgwNzY4Mn0.ueU4sCdrZSSODMSQS80TbzYtTayVsi8IUNgoHLRt2I4';
    let companyId;
    let employeeId;

    beforeEach(async () => {
        const company = await Companies.create({
            companyName: "testCompany",
            companyEmail: "testCompany23@gmail.com",
            companyPhoneNumber: "245151251",
            latitude: "213213131",
            longitude: "53252352",
            address: "Beirut",
            city: "Mazraa",
            country: "Lebanon"
        });

        companyId = company._id;
    });

    it('should error 400 for validation', async () => {
        const res = await request(app)
            .post(`/api/auth-employee/register`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                userName: null
            });

        expect(res.statusCode).toBe(400);
    });

    it('should create new employee', async () => {
        const res = await request(app)
            .post(`/api/auth-employee/register`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                companyID: companyId,
                userName: "EmployeeTest",
                email: "employeeTest23@gmail.com",
                password: "PDWwfwe232!FG"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("Employee account created successfully");
    });

    it('should error 400 for user exist', async () => {
        const res = await request(app)
            .post(`/api/auth-employee/register`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                companyID: companyId,
                userName: "EmployeeTest",
                email: "employeeTest23@gmail.com",
                password: "PDWwfwe232!FG"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("User already exists");
    });

    it('should error 400 for wrong password', async () => {
        const res = await request(app)
            .post('/api/auth-employee/login')
            .send({
                email: "employeeTest23@gmail.com",
                password: "awdadadwada!FG"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Incorrect Email Or Password');
    });

    it('should error 400 for wrong email', async () => {
        const res = await request(app)
            .post('/api/auth-employee/login')
            .send({
                email: "dawawdadwawd@gmail.com",
                password: "PDWwfwe232!FG"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Incorrect Email Or Password');
    });

    it('should error 400 for validaion', async () => {
        const res = await request(app)
            .post('/api/auth-employee/login')
            .send({
                email: null,
                password: null
            });

        expect(res.statusCode).toBe(400);
    });

    it('should login in existing user', async () => {
        const res = await request(app)
            .post('/api/auth-employee/login')
            .send({
                email: "employeeTest23@gmail.com",
                password: "PDWwfwe232!FG"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should get all employee', async () => {
        const res = await request(app)
            .get("/api/employee")
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);


        const employee = res.body.find(emp => emp.email === 'employeeTest23@gmail.com');
        expect(employee).toBeTruthy();
        employeeId = employee._id;
    });

    it('should delete employee', async () => {
        const res = await request(app)
            .delete(`/api/employee/${employeeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Employee deleted successfully');
    });
})