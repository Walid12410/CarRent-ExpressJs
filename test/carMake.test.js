const request = require("supertest");
const app = require("../app");

describe('Car Make API', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWFjNGU0NTY0Mjg2ZDU0Y2RlZTIyMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyOTgwNzY4Mn0.ueU4sCdrZSSODMSQS80TbzYtTayVsi8IUNgoHLRt2I4';
    let carMakeId;


    it("should check validation of create new car make" , async () => {
        const res = await request(app)
            .post('/api/car-make')
            .request('Authorization' , `Bearer ${token}`)
            .send({ carMakeName : null });

        expect(res.statusCode).toBe(400);
    });

    it("should create new car make" , async () => {
        const res = await request(app)
            .post('/api/car-make')
            .request('Authorization' , `Bearer ${token}`)
            .send({ carMakeName : "Hondass" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message' , 'Car make name added successfully');
    });

    it("should return 400 status code with message (car make taken)" , async () => {
        const res = await request(app)
            .post('/api/car-make')
            .request('Authorization' , `Bearer ${token}`)
            .send({ carMakeName : "Hondass" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message' , 'Car make name already created before');
    });

    it('shoud get all car make and extract the ID of the new car make', async () => {
        const res = await request(app).get('/api/car-make');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeIntanceOf(Array);

        const carMake = res.body.find(car => car.carMakeName === 'Hondass');
        expect(carMake).toBeTruthy();
        carMakeId = carMake._id;
    });

    it('shoud error 400 for updating existing car make' ,async() => {
        const res = await request(app)
            .put(`api/car-make/${carMakeId}`)
            .set('Authorization' , `Bearer ${token}`)
            .send({carMakeName : null});

        expect(res.statusCode).toBe(400);
    });

    it('shoud update the existing car make' , async () => {
        const res = await request(app)
            .put(`/api/car-make/${carMakeId}`)
            .set('Authorization' , `Bearer ${token}`)
            .send({carMakeName : "hondas"});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('CarMakeName' , 'hondas');
    });

    it('shoud delete the car make' ,async () => {
        const res = await request(app)
            .delete(`/api/car-make/${carMakeId}`)
            .set('Authorization' , `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message' , 'CarMake has been deleted successfully');
    });
});