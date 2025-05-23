const goals = [
{
    id: 'j',
    name: 'currentEarnedIncome',
    label: 'Current Earned Income (monthly)',
    type: 'number',
},
{
    id: 'k',
    name: 'earnedIncomeGoal',
    label: 'Earned Income Goal (monthly)',
    type: 'number',
},
{
    id: 'l',
    name: 'resultFreedom',
    label: 'Freedom Number',
    type: 'readonly',
},
{
    id: 'm',
    name: 'resultLifestyle',
    label: 'Lifestyle Number',
    type: 'readonly',
},
{
    id: 'c',
    name: 'earnedIncomeOptimizationPlan',
    label: 'Earned Income Optimization Plan',
    type: 'textarea',
},
{
    id: 'n',
    name: 'financialEducation',
    label: 'Financial education',
    type: 'boxselect',
},
{
    id: 'a',
    name: 'primaryGoal',
    label: 'Primary Goal',
    type: 'boxselect',
},
{
    id: 'i',
    name: 'biggestChallenge',
    label: 'Biggest Challenge',
    type: 'textarea',
},
{
    id: 'f',
    name: 'activePassivePreference',
    label: 'Lifestyle Preference',
    type: 'boxselect',
},

{
    id: 'g',
    name: 'temperament',
    label: 'Temperament',
    type: 'boxselect',
},

{
    id: 'h',
    name: 'riskPreference',
    label: 'Risk Preference',
    type: 'boxselect',
},

{
    id: 'd',
    name: 'primaryWealthStrategy',
    label: 'Primary Wealth Strategy',
    type: 'select',
}, 
{
    id: 'e',
    name: 'secondaryWealthStrategy',
    label: 'Secondary Wealth Strategy',
    type: 'select',
},
{
    id: 'b',
    name: 'legacyStatement',
    label: 'Legacy Statement',
    type: 'textarea',
},
{
    id: 'o',
    name: 'legacyModel',
    label: 'Legacy Model',
    type: 'boxselect',
},

];

const primaryWealthStrategy = [{
    id: 'd01',
    label: 'Savings/MoneyMarket/CD'
}, {
    id: 'd02',
    label: 'Home Ownership'
}, {
    id: 'd03',
    label: 'Bonds/Fixed Income'
}, {
    id: 'd04',
    label: 'Equities/Stocks/Funds'
}, {
    id: 'd05',
    label: 'Options/Futures'
}, {
    id: 'd06',
    label: 'Real Estate'
}, {
    id: 'd07',
    label: 'Precious Metals'
}, {
    id: 'd08',
    label: 'Crypto Assets (currencies/protocols/apps)'
}, {
    id: 'd09',
    label: 'Collectibles/Alternatives'
}, {
    id: 'd10',
    label: 'Active Business/Entrepreneurship'
}, {
    id: 'd10a',
    label: 'Passive Business/Entrepreneurship'
}, {
    id: 'd11',
    label: 'Intellectual Property/Licensing'
}, {
    id: 'd12',
    label: 'Private Money Lending'
}, {
    id: 'd13',
    label: 'Annuity or Insurance Policy'
}, {
    id: 'd14',
    label: 'Gambling'
}, {
    id: 'd15',
    label: 'Hope & Prayer'
}, {
    id: 'd16',
    label: 'Other'
}, ];

const secondaryWealthStrategy = [
    {
        id: 'e01',
        name: 'savings/MoneyMarket/CD',
        label: 'Savings/MoneyMarket/CD'
    }, {
        id: 'e02',
        name: 'homeOwnership',
        label: 'Home Ownership'
    }, {
        id: 'e03',
        name: 'bonds/Fixed Income',
        label: 'Bonds/Fixed Income'
    }, {
        id: 'e04',
        name: 'equities/Stocks/Funds',
        label: 'Equities/Stocks/Funds'
    }, {
        id: 'e05',
        name: 'options/Futures',
        label: 'Options/Futures'
    }, {
        id: 'e06',
        name: 'realEstate',
        label: 'Real Estate'
    }, {
        id: 'e07',
        name: 'preciousMetals',
        label: 'Precious Metals'
    }, {
        id: 'e08',
        name: 'cryptoAssets',
        label: 'Crypto Assets (currencies/protocols/apps)'
    }, {
        id: 'e09',
        name: 'collectibles/Alternatives',
        label: 'Collectibles/Alternatives'
    }, {
        id: 'e10',
        name: 'activeBusiness',
        label: 'Active Business/Entrepreneurship'
    }, {
        id: 'e11',
        name: 'passiveBusiness',
        label: 'Passive Business/Partnerships'
    }, {
        id: 'e12',
        name: 'intellectualProperty',
        label: 'Intellectual Property/Licensing'
    }, {
        id: 'e13',
        name: 'privateMoneyLending',
        label: 'Private Money Lending'
    }, {
        id: 'e14',
        name: 'annuity',
        label: 'Annuity or Insurance Policy'
    }, {
        id: 'e15',
        name: 'gambling',
        label: 'Gambling'
    }, {
        id: 'e16',
        name: 'hopePrayer',
        label: 'Hope & Prayer'
    }, {
        id: 'e17',
        name: 'other',
        label: 'Other'
    },
];

const activePassivePreference = [{
    id: 'f01',
    label: 'I prefer active investments (hands on)'
}, {
    id: 'f02',
    label: 'I prefer passive investments (hands off)'
},];

const temperament = [{
    id: 'g01',
    label: 'I am mostly impatient and/or not detail oriented',
}, {
    id: 'g02',
    label: 'I am mostly patient and/or detail oriented',
},];

const riskPreference = [{
    id: 'h01',
    label: 'I prefer high risk / high volatility',
}, {
    id: 'h02',
    label: 'I prefer low risk / low volatility',
},];

const primaryGoal = [
    {
        id:'i01',
        label: 'Increase my income',
        description: 'Learn skills to increase both earned and unearned income',
        value: 'increaseMyIncome',
        image: 'assets/images/increase-income.png'
    },
    {
        id:'i02',
        label: 'Keep a budget',
        description: 'Use simple ratios that make budgeting easier than ever',
        value: 'keepABudget',
        image: 'assets/images/onboard-budgeting.png'
    },
    {
        id:'i03',
        label: 'Pay off debt',
        description: 'Identify the fastest path and a no fail plan towards debt freedom',
        value: 'payOffDebt',
        image: 'assets/images/paydebt.png'
    },
    {
        id:'i04',
        label: 'Save for retirement',
        description: 'Use proven formulas to accelerate financial security and retirement',
        value: 'saveForeRetirement',
        image: 'assets/images/saveretirement.png'
    },
    {
        id:'i05',
        label: 'Invest like the wealthy',
        description: 'Model strategic mindsets and rules based systems to invest and trade like the wealthy',
        value: 'investLikeTheWeathly',
        image: 'assets/images/wealthyinvest.png'
    },
    {
        id:'i06',
        label: 'Create a legacy',
        description: 'Develop a strategic plan and build a legacy that lasts ',
        value: 'createALegacy',
        image: 'assets/images/legacy.png'
    },
];

const financialEducation = [
    {
        id:'j01',
        label: 'Novice',
        description: "I'm just starting with very little or no experience - help!",
        image:'assets/images/none.png',
        value: 'novice'
    },
    {
        id:'j02',
        label: 'Moderate',
        description: "I have some experience but am eager to improve my results!",
        image:'assets/images/moderate.png',
        value: 'moderate'
    },
    {
        id:'j03',
        label: 'Expert',
        description: "I'm a seasoned pro but still love to learn, improve and contribute!",
        image:'assets/images/expert.png',
        value: 'expert'
    },
]

const legacyModel = [
    {
        id: 'o01',
        label: 'Die & Distribute',
    },
    {
        id: 'o02',
        label: 'Charity',
    },
    {
        id: 'o03',
        label: 'Spend It',
    },
    {
        id: 'o04',
        label: 'Legacy',
    },
];

const constants = {
    goals,
    activePassivePreference,
    riskPreference,
    temperament,
    primaryWealthStrategy,
    secondaryWealthStrategy,
    primaryGoal,
    financialEducation,
    legacyModel,
}

function getGoalLabel(goalName:string, id:string) {
    constants[goalName].find(x => x===x.id)
}

export {
    constants as ExportedClass
};
