interface TProfile {
    firstName: string,
    lastName: string,
    avatar?: string,
    bio: string,
    location: string,
    phone: any,
    website: string,
    birthday: string,
    sex: string,
    email: string,
    countryCode?: any
    createdAt?: any
    timeZone?: any
}

export {
    TProfile as ExportedClass
};
