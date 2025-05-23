interface TFreedomCalculator {
    _id?: string;
    housing?: number;
    food?: number;
    utilities?: number;
    transportation?: number;
    other?: number;
    result: number;
}

export {
    TFreedomCalculator as ExportedClass
};