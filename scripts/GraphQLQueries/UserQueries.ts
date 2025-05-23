import gql from 'graphql-tag';

const user = gql`
    query user {
        user {
            id
            firstName
            lastName
            phone
            avatar
            access
            accessTags
            externalUserId
            signUpAt
            activeBalanceSheet
            defaultBalanceSheet
            migratedUser
            countryCode
            email
            bio
            location
            website
            birthday
            sex
            giving
            wealth
            debt
            living
            customAccounts {
                label
                value
            }
            customGoals {
                label
                value
            }
            housing
            food
            utilities
            transportation
            otherFreedom
            resultFreedom
            travel
            shopping
            entertainment
            otherLifestyle
            resultLifestyle
            immediatePersonalGoal
            financialEducation
            primaryGoal
            legacyModel
            legacyStatement
            earnedIncomeOptimizationPlan
            primaryWealthStrategy
            secondaryWealthStrategy
            activePassivePreference
            temperament
            riskPreference
            biggestChallenge
            currentEarnedIncome
            earnedIncomeGoal
            userOrigin
            lastLoginAt
            t1Target
            t2Target
            t3Target
            createdAt
            updatedAt
            hasCompletedOnboarding,
            implementationProgress,
            preferredCurrency,
            isDebtFree,
            accountSortOrderPref,
            didChangeAccess,
            timeZone,
            monthlyEarnedIncome
            annualContribution
            annualIncreaseContribution
            annualWithdrawal
            withdrawalStartingYear
            volatilityDrawdown
            everyNumberYears
            yearsInvested
            useND1WealthValue
            useUnearnedIncomeValues
            showMonthly
        }
    }
`

const updateUser = gql`
    mutation updateUser (
        $firstName: String
        $bio: String
        $location: String
        $website: String
        $birthday: Int
        $avatar: String
        $sex: String
        $lastName: String
        $userOrigin: String
        $externalUserId: Int
        $signUpAt: Int
        $lastLoginAt: Int
        $activeBalanceSheet: String
        $immediatePersonalGoal: String
        $primaryGoal: String
        $financialEducation: String
        $legacyModel: String
        $legacyStatement: String
        $earnedIncomeOptimizationPlan: String
        $primaryWealthStrategy: String
        $secondaryWealthStrategy: String
        $activePassivePreference: String
        $temperament: String
        $riskPreference: String
        $biggestChallenge: String
        $currentEarnedIncome: Float
        $earnedIncomeGoal: Float
        $giving: Float
        $wealth: Float
        $debt: Float
        $living: Float
        $customAccounts: [CustomAccountInput!]
        $customGoals: [CustomAccountInput!]
        $t1Target: Float
        $t2Target: Float
        $t3Target: Float
        $housing: Float
        $food: Float
        $utilities: Float
        $transportation: Float
        $otherFreedom: Float
        $resultFreedom: Float
        $travel: Float
        $shopping: Float
        $entertainment: Float
        $otherLifestyle: Float
        $resultLifestyle: Float
        $migratedUser: Boolean
        $hasCompletedOnboarding: Boolean
        $implementationProgress: String
        $preferredCurrency: String
        $isDebtFree: Boolean
        $accountSortOrderPref: String
        $didChangeAccess: Boolean
        $timeZone: String
    ) {
        updateUser(
            user: {
                firstName: $firstName
                bio: $bio
                location: $location
                website: $website
                birthday: $birthday
                avatar: $avatar
                sex: $sex
                lastName: $lastName
                userOrigin: $userOrigin
                externalUserId: $externalUserId
                signUpAt: $signUpAt
                lastLoginAt: $lastLoginAt
                activeBalanceSheet: $activeBalanceSheet
                immediatePersonalGoal: $immediatePersonalGoal
                financialEducation: $financialEducation
                primaryGoal: $primaryGoal
                legacyModel: $legacyModel
                legacyStatement: $legacyStatement
                earnedIncomeOptimizationPlan: $earnedIncomeOptimizationPlan
                primaryWealthStrategy: $primaryWealthStrategy
                secondaryWealthStrategy: $secondaryWealthStrategy
                activePassivePreference: $activePassivePreference
                temperament: $temperament
                riskPreference: $riskPreference
                biggestChallenge: $biggestChallenge
                currentEarnedIncome: $currentEarnedIncome
                earnedIncomeGoal: $earnedIncomeGoal
                giving: $giving
                wealth: $wealth
                debt: $debt
                living: $living
                customAccounts: $customAccounts
                customGoals: $customGoals
                t1Target: $t1Target
                t2Target: $t2Target
                t3Target: $t3Target
                housing: $housing
                food: $food
                utilities: $utilities
                transportation: $transportation
                otherFreedom: $otherFreedom
                resultFreedom: $resultFreedom
                travel: $travel
                shopping: $shopping
                entertainment: $entertainment
                otherLifestyle: $otherLifestyle
                resultLifestyle: $resultLifestyle
                migratedUser: $migratedUser
                hasCompletedOnboarding: $hasCompletedOnboarding
                implementationProgress: $implementationProgress
                preferredCurrency: $preferredCurrency
                isDebtFree: $isDebtFree
                accountSortOrderPref: $accountSortOrderPref
                didChangeAccess: $didChangeAccess
                timeZone: $timeZone
            }
        ) {
            id
            countryCode
            phone
            email
            access
            accessTags
            firstName
            bio
            location
            website
            birthday
            avatar
            sex
            lastName
            userOrigin
            externalUserId
            signUpAt
            lastLoginAt
            activeBalanceSheet
            defaultBalanceSheet
            immediatePersonalGoal
            primaryGoal
            financialEducation
            legacyModel
            legacyStatement
            earnedIncomeOptimizationPlan
            primaryWealthStrategy
            secondaryWealthStrategy
            activePassivePreference
            temperament
            riskPreference
            biggestChallenge
            currentEarnedIncome
            earnedIncomeGoal
            giving
            wealth
            debt
            living
            customAccounts {
                label
                value
            }
            customGoals {
                label
                value
            }
            t1Target
            t2Target
            t3Target
            housing
            food
            utilities
            transportation
            otherFreedom
            resultFreedom
            travel
            shopping
            entertainment
            otherLifestyle
            resultLifestyle
            migratedUser
            hasCompletedOnboarding
            implementationProgress
            preferredCurrency
            isDebtFree
            accountSortOrderPref
            didChangeAccess
            createdAt
            updatedAt     
            timeZone       
            monthlyEarnedIncome
            annualContribution
            annualIncreaseContribution
            annualWithdrawal
            withdrawalStartingYear
            volatilityDrawdown
            everyNumberYears
            yearsInvested
            useND1WealthValue
            useUnearnedIncomeValues
            showMonthly
        }
    }    
`
const updateEmail = gql`
    mutation updateEmail(
        $email: String!
        $otp: String!
    ) {
        updateEmail(
            email: $email
            otp: $otp
        ) {
            email
        }
    }
`

const updatePhone = gql`
    mutation updatePhone(
        $phone: String!
        $otp: String!
    ) {
        updatePhone(
            phone: $phone
            otp: $otp
        ) {
            phone
        }
    }
`

const verifyEmail = gql`
    mutation verifyEmail(
        $email: String!
    ) {
        verifyEmail(
            email: $email
        )
    }
`

const verifyPhone = gql`
    mutation verifyPhone(
        $phone: String!
    ) {
        verifyPhone(
            phone: $phone
        )
    }
`

const articles = gql`
    query articles {
        articles {
            id
            title
            coverImage {
                url
            }
            author {
                name
            }
            content
            footerCta {
                globalPostFooter
                learnMoreLink
            }
            accessTags
            userAccess
            updatedAt
            dateAndTime
        }
    }
`;

const resources = gql`
    query resources {
        resources {
            id
            title
            subTitle
            about
            image {
                url
            }
            authors {
                name
            }
            sections {
                id
                dateAndTime
                title
                contents {
                    id
                    dateAndTime
                    title
                    mediaTypeLength
                    summary
                    content
                    video {
                        url
                    }
                    refUrlOrImbed
                    audio {
                        url
                    }
                    document {
                        url
                    }
                }
            }
            accessTags
            userAccess
            updatedAt
        }
    }
`;

const resource = gql`
    query resource ($id: ID!) {
        resource (id: $id) {
            id
            title
            subTitle
            about
            image {
                url
            }
            authors {
                name
            }
            sections {
                id
                dateAndTime
                title
                contents {
                    id
                    dateAndTime
                    title
                    mediaTypeLength
                    summary
                    content
                    video {
                        url
                    }
                    refUrlOrImbed
                    audio {
                        url
                    }
                    document {
                        url
                    }
                }
            }
            accessTags
            userAccess
            updatedAt
        }
    }
`;

const getSignedUrl = gql`
    query getSignedUrl($fileName: String!) {
        getSignedUrl(fileName: $fileName) {
            fileName
            signedUrl
            expires
        }
    }
`;

const putSignedUrl = gql`
    query putSignedUrl($fileName: String!, $fileType: String!) {
        putSignedUrl(fileName: $fileName, fileType: $fileType) {
            fileName
            fileType
            signedUrl
            expires
        }
    }
`;

const createFile = gql`
    mutation createFile(
        $file: CreateFile!
    ) {
        createFile(
            file: $file
        ) {
            id
            userId
            name
            createdAt
            updatedAt
        }
    }
`

const deleteUser = gql`
    mutation deleteUser {
        deleteUser{
            msg
        }
    }
`

const configurations = gql`
    query configurations {
        configurations {
            key
            value
        }
    }
`;

const createPortalStripe = gql`
    mutation createPortal {
        createPortal {
            message
            url
        }
    }
`;

const bitrixToWbSyncQuery = gql`
    mutation bitrixToWbSync {
        bitrixToWbSync {
            msg
        }
    }
`;

export {
    user,
    updateUser,
    updateEmail,
    updatePhone,
    verifyEmail,
    verifyPhone,
    deleteUser,
    articles,
    resources,
    resource,
    getSignedUrl,
    putSignedUrl,
    createFile,
    configurations,
    createPortalStripe,
    bitrixToWbSyncQuery
}