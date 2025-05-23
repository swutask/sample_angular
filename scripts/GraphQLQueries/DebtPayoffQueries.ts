import gql from "graphql-tag";

const calculateDebtPayoff = gql`
  mutation calculateDebtPayoff(
      $sortPayoffBy: String
  ){
      calculateDebtPayoff(
        sortPayoffBy: $sortPayoffBy
      ){
        calculatedOutputs {
            currentPayoffText
            maximumInterestForAllDebts
            maximumInterestForAllDebtsText
            acceleratorPayoffText
            additionalCashFlowText
            acceleratorPayoffMonthsAndYears {
                months
                years
                lastMonth
                lastYear
            }
            currentPayoffMonthsAndYears {
                months
                years
                lastMonth
                lastYear
            }
            calculatedDebtAccelInterest
        }
        maximumInterestForAllDebts
        finalDebtResults {
            id
            isPaidOff
            receivingAccelAmount
            creditor
            balance
            originalBalance
            minPayment
            interestRate
            typeOfDebt
            typeOfDebtText
            debtTypeNumber
            maximumNumberOfPayments
            maximumNumberOfPaymentsRoundedUp
            maximumInterest
            monthBeganApplyingAccelAmount
            monthDebtWasPaidOff
            arrayIndex
            accelInterest
            accelText
            debtPayoffString
            debtNumber
            startingAccelAmount
            accelAmountForThisDebt
            accelNumberOfPayments
            accelNewBalance
            lastMonthAccelAmountWasUpdated
            minPaymentInterest
            payoffString
        }
        yearlySnapshots {
            year
            month
            last
            balanceOfAllDebts
            balanceOfAllDebtsWithAccel
        }
  }
}
`

export {
    calculateDebtPayoff
}