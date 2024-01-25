const nodemailer = require("nodemailer");
// 4VOdmLI7U6xyfCqD
// set up nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: "587", // must be 587 for gmail
    auth: {
        user: "nhoangkiet35@gmail.com",
        pass: "",
    },
});

// transporter.sendEmail is asychronous so let's wrap it in async function
const sendEmail = async (mailOptions) => {
    const { from, to, subject, text } = mailOptions;

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
    });
};

const mailOptions = {
    from: "nhoangkiet35@gmail.com", // this needs to be the same as your auth email address
    to: "1851050073kiet@ou.edu.vn", // this could be a string, or an array of string
    subject: "Welcome to the OAuth",
    text: "You will be proud if you can see this", // plain text content
};

(async () => {
    sendEmail(mailOptions);
})();
