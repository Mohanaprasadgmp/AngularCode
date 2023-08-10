// dev environment..

// export const environment = {
//   name: 'prod',
//   production: true,
//   settings: {
//     ccpUrl: 'https://ocs-np.my.connect.aws/ccp-v2',
//     domainUrl: 'https://ocs-np.my.connect.aws',
//     // admin url
//     // ssoUrl:
//     //   'https://gccsso.awsapps.com/start/#/saml/default/AmazonConnect_UAT_OCS/ins-229cc8286ec810c0',

//     // agent url
//     ssoUrl:
//       'https://gccsso.awsapps.com/start/#/saml/default/AmazonConnect_UAT_OCS_CCP/ins-079b84e37fc28cdf',
//     loginUrl: '',
//     loginPopup: false,
//     loginPopupAutoClose: true,
//     loginOptions: {
//       autoClose: true,
//       height: 600,
//       width: 400,
//       top: 0,
//       left: 0,
//     },
//     loggerEnabled: true,
//     EnableChat: true,
//     EnableAutoDial: false,
//     EnableOutboundUpload: false,
//     EnableReport: false,
//     StartingState: 'Unavailable',
//     region: 'us-east-1',
//     loggerUrl: '',
//     deskphoneSoftphone: true,
//     customCtiApi:
//       'https://7uajbrdn9e.execute-api.ap-southeast-1.amazonaws.com/uat/customcti',
//     callBack: 'D8pdLEpl',
//     walkin: 'jPy36JkY',
//     newCustomerMcareUrl:
//       'https://u-mcare.moe.gov.sg/main.aspx?etc=2&extraqs=&histKey=867286303&newWindow=true&pagetype=entityrecord',
//     newCaseMCareUrl:
//       'https://u-mcare.moe.gov.sg/main.aspx?etc=112&extraqs=?customerid=b**customerguid**%7d&customeridname=**customername**&customeridtype=contact&etc=112&histKey=745860218&newWindow=true&pagetype=entityrecord#776542045',
//   },
// };

// lab environment..

export const environment = {
  name: 'prod',
  production: true,
  settings: {
    ccpUrl: 'https://moe23.my.connect.aws/ccp-v2',
    domainUrl: 'https://moe23.my.connect.aws',
    loginUrl: '',
    loginPopup: false,
    loginPopupAutoClose: true,
    loginOptions: {
      autoClose: true,
      height: 600,
      width: 400,
      top: 0,
      left: 0,
    },
    loggerEnabled: true,
    EnableChat: true,
    EnableAutoDial: false,
    EnableOutboundUpload: false,
    EnableReport: false,
    StartingState: 'Unavailable',
    region: 'us-east-1',
    loggerUrl: '',
    deskphoneSoftphone: true,
    customCtiApi:
      'https://4firbm84ze.execute-api.us-east-1.amazonaws.com/moe/customcti',
    callBack: 'D8pdLEpl',
    walkin: 'jPy36JkY',
    newCustomerMcareUrl:
      'https://u-mcare.moe.gov.sg/main.aspx?etc=2&extraqs=&histKey=867286303&newWindow=true&pagetype=entityrecord',
    newCaseMCareUrl:
      'https://u-mcare.moe.gov.sg/main.aspx?etc=112&extraqs=?customerid=%7b**customerguid**%7d&customeridname=**customername**&customeridtype=contact&etc=112&histKey=745860218&newWindow=true&pagetype=entityrecord#776542045',
  },
};
