import gql from 'graphql-tag';

const sendOTP = gql`
    mutation sendOTP(
        $username: String!
        $recaptchaToken: String!
    ){
        sendOTP(
            username: $username,
            recaptchaToken: $recaptchaToken
        )
    }
`

const sendOTPWordpress = gql`
    mutation sendOTP(
        $username: String!
        $recaptchaToken: String!
        $isWordpress:Boolean
    ){
        sendOTP(
            username: $username,
            recaptchaToken: $recaptchaToken
            isWordpress: $isWordpress
        )
    }
`

const loginOTP = gql`
    mutation loginOTP(
        $otp: String!
        $username: String
        $recaptchaToken: String!
    ){
        loginOTP(
            otp: $otp
            username: $username
            recaptchaToken: $recaptchaToken
        ){
            accessToken
            refreshToken
            idToken
        }
    }
`

const loginOTPWordpress = gql`
    mutation loginOTP(
        $otp: String!
        $username: String
        $recaptchaToken: String!
        $isWordpress:Boolean
    ){
        loginOTP(
            otp: $otp
            username: $username
            recaptchaToken: $recaptchaToken
            isWordpress: $isWordpress
        ){
            accessToken
            refreshToken
            idToken
        }
    }
`

const signUp = gql`
    mutation signUp(
        $countryCode: String!
        $phone: String!
        $recaptchaToken: String!
    ) {
        signUp(
            countryCode: $countryCode
            phone: $phone
            recaptchaToken: $recaptchaToken
        ) {
            id
            phone
            access
            avatar
        }
    }
`

export {
    sendOTP,
    loginOTP,
    signUp,
    sendOTPWordpress,
    loginOTPWordpress,
}