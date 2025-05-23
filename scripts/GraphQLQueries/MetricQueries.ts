import gql from "graphql-tag";

const metricQuery = gql`
mutation getMetricHistoryByUser(
    $metricName:String!
    ){
        getMetricHistoryByUser(
            metricName: $metricName,
         ){
            metricValue,
            date
         }
    }`

const metricHistoryByAccount = gql`
    mutation getMetricHistoryByAccount(
        $accountId:String! 
        $metricName:String!
    ){
        getMetricHistoryByAccount(
            accountId: $accountId 
            metricName:$metricName
        ){
            metricValue,
            price,
            quantity,
            date
        }
    }`

export { metricQuery, metricHistoryByAccount }