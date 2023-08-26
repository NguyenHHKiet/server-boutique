var Mailchimp = require("mailchimp-api-v3");

var mailchimp = new Mailchimp("2648f4345d5943bbadd422b7dca04ddd-us21");

//Promise style
mailchimp
    .get({
        path: "/lists/861b818563",
    })
    .then(function (result) {
        console.log(result);
    })
    .catch(function (err) {
        console.log(err);
    });

// const mailchimp = require("@mailchimp/mailchimp_marketing");
// mailchimp.setConfig({
//     apiKey: "2648f4345d5943bbadd422b7dca04ddd-us21",
//     server: "us21",
// });

// // const mailchimp = require("@mailchimp/mailchimp_transactional")(
// //     "2648f4345d5943bbadd422b7dca04ddd-us21"
// // );

// // const message = {
// //     from_email: "nhoangkiet35@gmail.com",
// //     subject: "Hello world",
// //     text: "Welcome to Mailchimp Transactional!",
// //     to: [
// //         {
// //             email: "kietnhhfx20997@funix.edu.vn",
// //             type: "to",
// //         },
// //     ],
// // };

// // async function run() {
// //     const response = await mailchimp.messages.send({
// //         message,
// //     });
// //     console.log(response);
// // }

// // module.exports = run;

// const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
//     "2648f4345d5943bbadd422b7dca04ddd-us21"
// );

// const run = async () => {
//     const response = await mailchimpClient.senders.addDomain({
//         domain: "nhoangkiet35@gmail.com",
//     });
//     console.log(response);
// };

// module.exports = run;
