interface TLifestyleCalculator {
    _id?: string;
    freedomNumber?: number;
    travel?: number;
    shopping?: number;
    entertainment?: number;
    other?: number;
    result: number;
}

export {
    TLifestyleCalculator as ExportedClass
};