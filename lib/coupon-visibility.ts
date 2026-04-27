export function getPublicCouponWhere(extraWhere = {}) {
    const now = new Date()

    return {
        isActive: true,

        AND: [
            {
                OR: [{ startsAt: null }, { startsAt: { lte: now } }],
            },
            {
                OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
            },
        ],

        ...extraWhere,
    }
}