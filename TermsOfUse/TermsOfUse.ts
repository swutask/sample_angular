import {
    Component
} from '@angular/core';
@Component({
    templateUrl: 'TermsOfUse.html',
    selector: 'page-terms-of-use[start-page]',
    styleUrls: ['TermsOfUse.scss']
})
export class TermsOfUse {
    public currentItem: any = null;
    public mappingData: any = {};
    agreementText() {
        return "By subscribing to our application, you accept the general terms and conditions defined below: \n" +
            "\n" +
            "\n" +
            "This Application collects some Personal Data from its Users. \n" +
            "\n" +
            "\n" +
            "Summary \n" +
            "\n" +
            "Personal Data collected for the following purposes and using the following services: \n" +
            "\n" +
            "Access to third party services' accounts \n" +
            "\n" +
            "Access to the Facebook account \n" +
            "Permissions: In app registration, Likes and Publish to the Wall \n" +
            "\n" +
            "Access to the Twitter account \n" +
            "Personal Data: In app registration and Various types of Data \n" +
            "\n" +
            "Content commenting \n" +
            "\n" +
            "Disqus \n" +
            "Personal Data: Cookie and Usage Data \n" +
            "\n" +
            "Interaction with external social networks and platforms \n" +
            "\n" +
            "Facebook Like button, social widgets \n" +
            "Personal Data: Cookie, Usage Data, Profile information \n" +
            "\n" +
            "Full policy \n" +
            "\n" +
            "Data Controller and Owner \n" +
            "\n" +
            "Types of Data collected \n" +
            "Among the types of Personal Data that this Application collects, by itself or through third parties, there are: Cookie and Usage Data. \n" +
            "\n" +
            "Other Personal Data collected may be described in other sections of this privacy policy or by dedicated explanation text contextually with the Data collection. \n" +
            "The Personal Data may be freely provided by the User, or collected automatically when using this Application. \n" +
            "Any use of Cookies - or of other tracking tools - by this Application or by the owners of third party services used by this Application, unless stated otherwise, serves to identify Users and remember their preferences, for the sole purpose of providing the service required by the User. \n" +
            "Failure to provide certain Personal Data may make it impossible for this Application to provide its services. \n" +
            "\n" +
            "The User assumes responsibility for the Personal Data of third parties published or shared through this Application and declares to have the right to communicate or broadcast them, thus relieving the Data Controller of all responsibility. \n" +
            "\n" +
            "Mode and place of processing the Data \n" +
            "\n" +
            "Methods of processing \n" +
            "The Data Controller processes the Data of Users in a proper manner and shall take appropriate security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data. \n" +
            "The Data processing is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related to the purposes indicated. In addition to the Data Controller, in some cases, the Data may be accessible to certain types of persons in charge, involved with the operation of the site (administration, sales, marketing, legal, system administration) or external parties (such as third party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, if necessary, as Data Processors by the Owner. The updated list of these parties may be requested from the Data Controller at any time. \n" +
            "\n" +
            "Place \n" +
            "The Data is processed at the Data Controller's operating offices and in any other places where the parties involved with the processing are located. For further information, please contact the Data Controller. \n" +
            "\n" +
            "Retention time \n" +
            "The Data is kept for the time necessary to provide the service requested by the User, or stated by the purposes outlined in this document, and the User can always request that the Data Controller suspend or remove the data. \n" +
            "\n" +
            "The use of the collected Data \n" +
            "The Data concerning the User is collected to allow the Application to provide its services, as well as for the following purposes: Access to third party services' accounts, Creation of the user in app profile, Content commenting and Interaction with external social networks and platforms. \n" +
            "The Personal Data used for each purpose is outlined in the specific sections of this document. \n" +
            "\n" +
            "Facebook permissions asked by this Application \n" +
            "This Application may ask some Facebook permissions allowing it to perform actions with the User's Facebook account and to retrieve information, including Personal Data, from it. \n" +
            "\n" +
            "For more information about the following permissions, refer to the Facebook permissions documentation (https://developers.facebook.com/docs/authentication/permissions/) and to the Facebook privacy policy (https://www.facebook.com/about/privacy/). \n" +
            "\n" +
            "The permissions asked are the following: \n" +
            "\n" +
            "Basic information \n" +
            "By default, this includes certain User’s Data such as id, name, picture, gender, and their locale. Certain connections of the User, such as the Friends, are also available. If the user has made more of their data public, more information will be available. \n" +
            "\n" +
            "Likes \n" +
            "Provides access to the list of all of the pages the user has liked. \n" +
            "\n" +
            "Publish to the Wall \n" +
            "Enables the app to post content, comments, and likes to a user's stream and to the streams of the user's friends. \n" +
            "\n" +
            "Detailed information on the processing of Personal Data \n" +
            "Personal Data is collected for the following purposes and using the following services: \n" +
            "\n" +
            "Access to third party services' accounts \n" +
            "These services allow this Application to access Data from your account on a third party service and perform actions with it. \n" +
            "These services are not activated automatically, but require explicit authorization by the User. \n" +
            "\n" +
            "Access to the Facebook account (This Application) \n" +
            "This service allows this Application to connect with the User's account on the Facebook social network, provided by Facebook Inc. \n" +
            "\n" +
            "Permissions asked: Likes and Publish to the Wall. \n" +
            "\n" +
            "Place of processing : USA – Privacy Policy https://www.facebook.com/policy.php \n" +
            "\n" +
            "Access to the Twitter account (This Application) \n" +
            "This service allows this Application to connect with the User's account on the Twitter social network, provided by Twitter Inc. \n" +
            "\n" +
            "Personal Data collected: Various types of Data. \n" +
            "\n" +
            "Place of processing : USA – Privacy Policy http://twitter.com/privacy \n" +
            "\n" +
            "Content commenting \n" +
            "Content commenting services allow Users to make and publish their comments on the contents of this Application.\n" +
            "Depending on the settings chosen by the Owner, Users may also leave anonymous comments. If there is an email address among the Personal Data provided by the User, it may be used to send notifications of comments on the same content. Users are responsible for the content of their own comments. \n" +
            "If a content commenting service provided by third parties is installed, it may still collect web traffic data for the pages where the comment service is installed, even when users do not use the content commenting service. \n" +
            "\n" +
            "Disqus (Disqus) \n" +
            "Disqus is a content commenting service provided by Big Heads Labs Inc. \n" +
            "\n" +
            "Personal Data collected: Cookie and Usage Data. \n" +
            "\n" +
            "Place of processing : USA – Privacy Policy http://docs.disqus.com/help/30/ \n" +
            "\n" +
            "Interaction with external social networks and platforms \n" +
            "\n" +
            "These services allow interaction with social networks or other external platforms directly from the pages of this Application. \n" +
            "The interaction and information obtained by this Application are always subject to the User’s privacy settings for each social network. \n" +
            "If a service enabling interaction with social networks is installed it may still collect traffic data for the pages where the service is installed, even when Users do not use it. \n" +
            "\n" +
            "Facebook Like button and social widgets (Facebook) \n" +
            "The Facebook Like button and social widgets are services allowing interaction with the Facebook social network provided by Facebook Inc. \n" +
            "\n" +
            "Personal Data collected: Cookie and Usage Data. \n" +
            "\n" +
            "Place of processing : USA – Privacy Policy http://www.facebook.com/privacy/explanation.php \n" +
            "\n" +
            "Additional information about Data collection and processing \n" +
            "\n" +
            "Legal action \n" +
            "The User's Personal Data may be used for legal purposes by the Data Controller, in Court or in the stages leading to possible legal action arising from improper use of this Application or the related services. \n" +
            "The User is aware of the fact that the Data Controller may be required to reveal personal data upon request of public authorities. \n" +
            "\n" +
            "Additional information about User's Personal Data \n" +
            "In addition to the information contained in this privacy policy, this Application may provide the User with additional and contextual information concerning particular services or the collection and processing of Personal Data upon request. \n" +
            "\n" +
            "System Logs and Maintenance \n" +
            "For operation and maintenance purposes, this Application and any third party services may collect files that record interaction with this Application (System Logs) or use for this purpose other Personal Data (such as IP Address). \n" +
            "\n" +
            "Information not contained in this policy \n" +
            "More details concerning the collection or processing of Personal Data may be requested from the Data Controller at any time. Please see the contact information at the beginning of this document. \n" +
            "\n" +
            "The rights of Users \n" +
            "Users have the right, at any time, to know whether their Personal Data has been stored and can consult the Data Controller to learn about their contents and origin, to verify their accuracy or to ask for them to be supplemented, cancelled, updated or corrected, or for their transformation into anonymous format or to block any data held in violation of the law, as well as to oppose their treatment for any and all legitimate reasons. Requests should be sent to the Data Controller at the contact information set out above. \n" +
            "\n" +
            "This Application does not support “Do Not Track” requests. \n" +
            "To determine whether any of the third party services it uses honor the “Do Not Track” requests, please read their privacy policies. \n" +
            "\n" +
            "Changes to this privacy policy \n" +
            "The Data Controller reserves the right to make changes to this privacy policy at any time by giving notice to its Users on this page. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom. If a User objects to any of the changes to the Policy, the User must cease using this Application and can request that the Data Controller erase the Personal Data. Unless stated otherwise, the then-current privacy policy applies to all Personal Data the Data Controller has about Users. \n" +
            "\n" +
            "\n" +
            "Definitions and legal references \n" +
            "\n" +
            "Personal Data (or Data) \n" +
            "Any information regarding a natural person, a legal person, an institution or an association, which is, or can be, identified, even indirectly, by reference to any other information, including a personal identification number. \n" +
            "\n" +
            "Usage Data \n" +
            "Information collected automatically from this Application (or third party services employed in this Application ), which can include: the IP addresses or domain names of the computers utilized by the Users who use this Application, the URI addresses (Uniform Resource Identifier), the time of the request, the method utilized to submit the request to the server, the size of the file received in response, the numerical code indicating the status of the server's answer (successful outcome, error, etc.), the country of origin, the features of the browser and the operating system utilized by the User, the various time details per visit (e.g., the time spent on each page within the Application) and the details about the path followed within the Application with special reference to the sequence of pages visited, and other parameters about the device operating system and/or the User's IT environment. \n" +
            "\n" +
            "User \n" +
            "The individual using this Application, which must coincide with or be authorized by the Data Subject, to whom the Personal Data refer. \n" +
            "\n" +
            "Data Subject \n" +
            "The legal or natural person to whom the Personal Data refers to. \n" +
            "\n" +
            "Data Processor (or Data Supervisor) \n" +
            "The natural person, legal person, public administration or any other body, association or organization authorized by the Data Controller to process the Personal Data in compliance with this privacy policy. \n" +
            "\n" +
            "Data Controller (or Owner) \n" +
            "The natural person, legal person, public administration or any other body, association or organization with the right, also jointly with another Data Controller, to make decisions regarding the purposes, and the methods of processing of Personal Data and the means used, including the security measures concerning the operation and use of this Application. The Data Controller, unless otherwise specified, is the Owner of this Application. \n" +
            "\n" +
            "This Application \n" +
            "The hardware or software tool by which the Personal Data of the User is collected. \n" +
            "\n" +
            "Cookie \n" +
            "Small piece of data stored in the User's device. \n" +
            "\n" +
            "Legal information \n" +
            "Notice to European Users: this privacy statement has been prepared in fulfillment of the obligations under Art. 10 of EC Directive n. 95/46/EC, and under the provisions of Directive 2002/58/EC, as revised by Directive 2009/136/EC, on the subject of Cookies. \n" +
            "This privacy policy relates solely to this Application. \n";
    }
    constructor() { }
}