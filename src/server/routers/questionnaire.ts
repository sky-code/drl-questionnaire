import {createRouter} from "~/server/createRouter";
import {prisma} from "~/server/prisma";
import {z} from "zod";
import {Prisma} from "@prisma/client";
import {userReport} from "~/server/models/questionnaire";

const defaultUserAnswersSelect = Prisma.validator<Prisma.UserAnswersSelect>()({
    id: true,
    createdAt: true,
    userEmail: true,
    fullName: true,
    dob: true,
    happy: true,
    energetic: true,
    hopefull: true,
    sleptHours: true
})

export const getAverage = () => {
    prisma.userAnswers
}

export const questionnaireRouter = createRouter()
    .query('report', {
        input: z.object({
            userEmail: z.string(),
        }),
        async resolve({input}) {
            const report = await userReport(input.userEmail)
            return report
        }
    })
    .mutation('add', {
        input: z.object({
            userEmail: z.string(),
            fullName: z.string(),
            dob: z.date(),
            happy: z.number().min(1).max(5),
            energetic: z.number().min(1).max(5),
            hopefull: z.number().min(1).max(5),
            sleptHours: z.number().min(0).max(24),
        }),
        async resolve({input}) {
            const userAnswers = await prisma.userAnswers.create({
                data: input,
                select: defaultUserAnswersSelect
            })
            return userAnswers
        }
    })