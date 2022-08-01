import {prisma} from '~/server/prisma';
import moment from 'moment';

function normalizeNumbers(avgObject: any) {
    const props = ['happy', 'energetic', 'hopefull', 'sleptHours']
    props.forEach(p => {
        if (avgObject[p]?.toFixed) {
            avgObject[p] = avgObject[p]?.toFixed(2)
        }
    })
    return avgObject
}

function percentageComparedTo(value: number | undefined | null, compareTo?: number | undefined | null) {
    if (value == null || compareTo == null) {
        return null
    }
    if (compareTo == 0) {
        return '0' // equal
    }
    const newValue = value - compareTo
    const percent  = (newValue / value) * 100
    return `${value > compareTo ? '-': ''} ${percent.toFixed(2)}`
}

export async function userAverage(userEmail: string, only_today: boolean = true) {
    const today_start = moment().startOf('day')
    const today_end = moment().endOf('day')
    const today_filter: any = {}
    if (only_today) {
        today_filter.createdAt = {
            gte: today_start.toDate(),
            lte: today_end.toDate()
        }
    }
    const aggregations = await prisma.userAnswers.aggregate({
        _avg: {
            happy: true,
            energetic: true,
            hopefull: true,
            sleptHours: true,
        },
        where: {
            userEmail: userEmail,
            ...today_filter
        },
    })
    normalizeNumbers(aggregations._avg)
    return aggregations._avg
}

export async function averageSameAge(userEmail: string): Promise<any> {
    const lastUserAnswer = await prisma.userAnswers.findFirst({
        where: {
            userEmail: userEmail
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (!lastUserAnswer) {
        return {}
    }
    const dob = lastUserAnswer.dob
    const d = moment().valueOf() - moment(dob).year(moment().year()).valueOf()
    const toDate = moment(dob).add(d).toDate()
    const aggregations = await prisma.userAnswers.aggregate({
        _avg: {
            happy: true,
            energetic: true,
            hopefull: true,
            sleptHours: true,
        },
        where: {
            userEmail: userEmail,
            dob: {
                gte: dob,
                lte: toDate
            }
        },
    })
    normalizeNumbers(aggregations._avg)
    return aggregations._avg
}

export async function userReport(userEmail: string) {
    const average = await userAverage(userEmail, false)
    const averageToday = await userAverage(userEmail, true)
    const averageSameAgeGroup = await averageSameAge(userEmail)

    const diffTodayToAverage: any = {
        happy: averageToday.happy && average.happy && averageToday.happy - average.happy,
        energetic: averageToday.energetic && average.energetic && averageToday.energetic - average.energetic,
        hopefull: averageToday.hopefull && average.hopefull && averageToday.hopefull - average.hopefull,
        sleptHours: averageToday.sleptHours && average.sleptHours && averageToday.sleptHours - average.sleptHours,
    }
    normalizeNumbers(diffTodayToAverage)
    diffTodayToAverage.happyPercentage = percentageComparedTo(averageToday.happy, diffTodayToAverage.happy)
    diffTodayToAverage.energeticPercentage = percentageComparedTo(averageToday.energetic, diffTodayToAverage.energetic)
    diffTodayToAverage.hopefullPercentage = percentageComparedTo(averageToday.hopefull, diffTodayToAverage.hopefull)
    diffTodayToAverage.sleptHoursPercentage = percentageComparedTo(averageToday.sleptHours, diffTodayToAverage.sleptHours)

    const diffUserAverageToSameAgeGroup: any = {
        happy: average.happy && averageSameAgeGroup.happy && average.happy - averageSameAgeGroup.happy,
        energetic: average.energetic && averageSameAgeGroup.energetic && average.energetic - averageSameAgeGroup.energetic,
        hopefull: average.hopefull && averageSameAgeGroup.hopefull && average.hopefull - averageSameAgeGroup.hopefull,
        sleptHours: average.sleptHours && averageSameAgeGroup.sleptHours && average.sleptHours - averageSameAgeGroup.sleptHours,
    }
    normalizeNumbers(diffUserAverageToSameAgeGroup)
    diffUserAverageToSameAgeGroup.happyPercentage = percentageComparedTo(average.happy, averageSameAgeGroup.happy)
    diffUserAverageToSameAgeGroup.energeticPercentage = percentageComparedTo(average.energetic, averageSameAgeGroup.energetic)
    diffUserAverageToSameAgeGroup.hopefullPercentage = percentageComparedTo(average.hopefull, averageSameAgeGroup.hopefull)
    diffUserAverageToSameAgeGroup.sleptHoursPercentage = percentageComparedTo(average.sleptHours, averageSameAgeGroup.sleptHours)

    return {
        userAverage: average,
        userAverageToday: averageToday,
        averageSameAgeGroup: averageSameAgeGroup,
        diffTodayToAverage: diffTodayToAverage,
        diffUserAverageToSameAgeGroup: diffUserAverageToSameAgeGroup
    }
}
