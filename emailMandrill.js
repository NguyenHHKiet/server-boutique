var nodemailer = require("nodemailer");
var mandrillTransport = require("nodemailer-mandrill-transport");

/*
 * Configuring mandrill transport.
 * Copy your API key here.
 */

var smtpTransport = nodemailer.createTransport(
    mandrillTransport({
        auth: {
            apiKey: "md-4wJ8K7zLdIOrccFZtTkt6w",
        },
    })
);

// Put in email details.

let mailOptions = {
    from: "nhoangkiet35@gmail.com",
    to: "1851050073kiet@ou.edu.vn",
    // to: "kietnhhfx20997@funix.edu.vn",
    subject: "This is from Mandrill",
    html: "Hello,<br>Sending this email using Node and Mandrill",
};

// Sending email.
smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
        throw new Error("Error in sending email");
    }
    console.log("Message sent: " + JSON.stringify(response));
});
