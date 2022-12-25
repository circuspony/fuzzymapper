
export const getFactorById = (factorData, id) => {
    return factorData.filter(f => f !== null).find(f => f.id === id)
}