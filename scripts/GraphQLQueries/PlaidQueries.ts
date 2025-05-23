import gql from 'graphql-tag';

const createLink = gql`
    mutation createLinkToken(
        $liability: Boolean
        $all: Boolean
    ){
        createLinkToken(
            liability: $liability
            all: $all
        ){
            link_token
            expiration
            request_id
        }
    }
`

const updateLink = gql`
    mutation updateLinkToken(
        $plaidItemId: String!
        $newAccount: Boolean!
    ){
        updateLinkToken(
            plaidItemId: $plaidItemId
            newAccount: $newAccount
        ){
            link_token
            expiration
            request_id
        }
    }
`

const setAccess = gql`
    mutation setAccessToken(
        $public_token: String!
        $institution_id: String!
    ) {
        setAccessToken(
            public_token: $public_token
            institution_id: $institution_id
        ){
            itemId
            userId
        }
    }
`

const getAccounts = gql`
    mutation getPlaidAccounts(
        $item_id: String!
    ) {
        getPlaidAccounts(
            item_id: $item_id
        ){
            accounts{
                account_id
                balances{
                    available
                    current
                    limit
                }
                mask
                name
            }
            item
            request_id
        }
    }
`

const getBalance = gql`
    mutation getPlaidBalance(
        $item_id: String!
    ) {
        getPlaidBalance(
            item_id: $item_id
        ){
            account_id
            balances{
                available
                current
                limit
                iso_currency_code
                unofficial_currency_code
                last_updated_datetime
            }
            mask
            name
        }
    }
`

const getTransactions = gql`
    mutation getPlaidTransactions(
        $id: String!
        $start_date: String!
        $end_date: String!
    ) {
        getPlaidTransactions(
            id: $id
            start_date: $start_date
            end_date: $end_date
        ){
            accounts{
                account_id
                balances{
                    available
                    current
                    limit
                }
                mask
                name
                type
                subtype
                holdings{
                    account_id
                    security_id
                    institution_price
                    institution_price_as_of
                    institution_value
                    cost_basis
                    quantity
                    iso_currency_code
                    security{
                        security_id
                        isin
                        cusip
                        sedol
                        institution_security_id
                        institution_id
                        proxy_security_id
                        name
                        ticker_symbol
                        is_cash_equivalent
                        type
                        close_price
                        close_price_as_of
                        iso_currency_code
                    }
                }
            }
            transactions{
                account_id
                amount
                iso_currency_code
                unofficial_currency_code
                category
                category_id
                check_number
                payment_channel
                authorized_date
                authorized_datetime
                date
                datetime
                location{
                    address
                    city
                    region
                    postal_code
                    country
                    lat
                    lon
                    store_number
                }
                name
                merchant_name
                payment_meta{
                    by_order_of
                    payee
                    payer
                    payment_method
                    payment_processor
                    ppd_id
                    reason
                    reference_number
                }
                pending
                pending_transaction_id
                account_owner
                transaction_id
                transaction_code
            }
            item
            request_id
            total_transactions
        }
    }
`

const deleteAccountByPlaidItem = gql`
    mutation deleteAccountByPlaidItemId(
        $id: String!
    ){
        deleteAccountByPlaidItemId(
            id: $id
        ){
            id
            name
            description
            assetType
            currentBalance
            monthlyExpense
            minPayment
            referenceUrl
            accountType
            costBasis
            userEntity
            liquidationPriority
            assetAssociation
            excludeFromDebtPayoffCalc
            payTaxFromExistingAsset
            investmentType
            sharesOwned
            sharePrice
            unitsOwned
            unitPrice
            useNominalValues
            excludeFromWithdrawal
            reinvestIntoOtherAssets
            estimatedYearlyIncome
            annualIncomeIncrease
            zvaIncome
            zvaFrequency
            additionalContribution
            additionalContribHowOften
            annualAppreciation
            compoundDRIP
            currentYield
            distributionFrequency
            excludeFromCompoundReturnCalc
            fractionalReinvestment
            liquidityChaosHedge
            monthlyIncome
            taxRate
            yieldGrowthRate
            createdAt
            updatedAt
            interestRate
            liabilityType
            plaid
            plaidAccountId
        }
    }
`

const unlinkPlaidItemQuery = gql`
    mutation unlinkPlaidItem(
        $id: String!
    ){
        unlinkPlaidItem(
            id: $id
        ){
            id
            name
            description
            assetType
            currentBalance
            monthlyExpense
            minPayment
            referenceUrl
            accountType
            costBasis
            userEntity
            liquidationPriority
            assetAssociation
            excludeFromDebtPayoffCalc
            payTaxFromExistingAsset
            investmentType
            sharesOwned
            sharePrice
            unitsOwned
            unitPrice
            useNominalValues
            excludeFromWithdrawal
            reinvestIntoOtherAssets
            estimatedYearlyIncome
            annualIncomeIncrease
            zvaIncome
            zvaFrequency
            additionalContribution
            additionalContribHowOften
            annualAppreciation
            compoundDRIP
            currentYield
            distributionFrequency
            excludeFromCompoundReturnCalc
            fractionalReinvestment
            liquidityChaosHedge
            monthlyIncome
            taxRate
            yieldGrowthRate
            createdAt
            updatedAt
            interestRate
            liabilityType
            plaid
            plaidAccountId
        }
    }
`

const getPlaidAccountsByUserId = gql`
    mutation getPlaidAccountsByUserId {
        getPlaidAccountsByUserId {
            itemId
            institutionId
            institutionName
            institutionLogo
            institutionColor
            institutionUrl
            accounts {
                id
                name
                description
                assetType
                currentBalance
                monthlyExpense
                minPayment
                referenceUrl
                accountType
                costBasis
                userEntity
                liquidationPriority
                assetAssociation
                excludeFromDebtPayoffCalc
                payTaxFromExistingAsset
                investmentType
                sharesOwned
                sharePrice
                unitsOwned
                unitPrice
                useNominalValues
                excludeFromWithdrawal
                reinvestIntoOtherAssets
                estimatedYearlyIncome
                annualIncomeIncrease
                zvaIncome
                zvaFrequency
                additionalContribution
                additionalContribHowOften
                annualAppreciation
                compoundDRIP
                currentYield
                distributionFrequency
                excludeFromCompoundReturnCalc
                fractionalReinvestment
                liquidityChaosHedge
                monthlyIncome
                taxRate
                yieldGrowthRate
                createdAt
                updatedAt
                interestRate
                liabilityType
                plaid
                plaidAccountId
                plaidItemid
                excludeFromFurtherInvestment
                updateRequired
                lastWebhookErrorCode
                permissionRevoked
                parentHolding
                childHoldingIds
            }
        }
    }
`;

const updateAccount = gql`
    mutation updateAccountsResetByItemId(
        $id: String!
    ){
        updateAccountsResetByItemId(
            id: $id
        ){
            itemId
            institutionId
            institutionName
            institutionLogo
            institutionColor
            institutionUrl
            accounts {
                id
                name
                description
                assetType
                currentBalance
                monthlyExpense
                minPayment
                referenceUrl
                accountType
                costBasis
                userEntity
                liquidationPriority
                assetAssociation
                excludeFromDebtPayoffCalc
                payTaxFromExistingAsset
                investmentType
                sharesOwned
                sharePrice
                unitsOwned
                unitPrice
                useNominalValues
                excludeFromWithdrawal
                reinvestIntoOtherAssets
                estimatedYearlyIncome
                annualIncomeIncrease
                zvaIncome
                zvaFrequency
                additionalContribution
                additionalContribHowOften
                annualAppreciation
                compoundDRIP
                currentYield
                distributionFrequency
                excludeFromCompoundReturnCalc
                fractionalReinvestment
                liquidityChaosHedge
                monthlyIncome
                taxRate
                yieldGrowthRate
                createdAt
                updatedAt
                interestRate
                liabilityType
                plaid
                plaidAccountId
                plaidItemid
                excludeFromFurtherInvestment
                updateRequired
                lastWebhookErrorCode
                permissionRevoked
            }
        }
    }
`

const syncByPlaidItem = gql`
    mutation syncByPlaidItemId(
        $id: String!
    ){
        syncByPlaidItemId(
            id: $id
        ){
            msg
        }
    }
`

const syncAllPlaidItem = gql`
    mutation syncAllPlaidItems{
        syncAllPlaidItems{
            msg
        }
    }
`

export {
    createLink,
    updateLink,
    setAccess,
    getAccounts,
    getBalance,
    getTransactions,
    deleteAccountByPlaidItem,
    unlinkPlaidItemQuery,
    getPlaidAccountsByUserId,
    updateAccount,
    syncByPlaidItem,
    syncAllPlaidItem,
}