/**
 * Integration test example for the `post` router
 */
import {averageSameAge, userAverage} from "~/server/models/questionnaire";
import {prisma} from "~/server/prisma";

test('average today', async () => {
    const userEmail = 'test@gmail.com'
    const userAnswers = [
        {
            userEmail,
            fullName: userEmail,
            dob: new Date(),
            happy: 2,
            energetic: 2,
            hopefull: 2,
            sleptHours: 2,
        },
        {
            userEmail,
            fullName: userEmail,
            dob: new Date(),
            happy: 3,
            energetic: 3,
            hopefull: 3,
            sleptHours: 3,
        }
    ]
    await Promise.all(userAnswers.map(input => {
        return prisma.userAnswers.create({data: input})
    }))
    const avg = await userAverage(userEmail, true)

    expect(avg).toBeTruthy();
});

test('average same age', async () => {
    const userAnswers = [
        {
            userEmail: 'test1@gmail.com',
            fullName: 'test1',
            dob: new Date('1991-05-19'),
            happy: 2,
            energetic: 2,
            hopefull: 2,
            sleptHours: 2,
        },
        {
            userEmail: 'test1@gmail.com',
            fullName: 'test1',
            dob: new Date('1991-05-19'),
            happy: 3,
            energetic: 3,
            hopefull: 3,
            sleptHours: 3,
        },
        {
            userEmail: 'test3@gmail.com',
            fullName: 'test3',
            dob: new Date('2001-05-30'),
            happy: 3,
            energetic: 3,
            hopefull: 3,
            sleptHours: 3,
        }
    ]
    await Promise.all(userAnswers.map(input => {
        return prisma.userAnswers.create({data: input})
    }))
    const avg = await averageSameAge('test1@gmail.com')

    expect(avg).toBeTruthy();
})