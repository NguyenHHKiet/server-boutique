const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
    "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";

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = "My {{params.subject}}";
sendSmtpEmail.htmlContent =
    "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
sendSmtpEmail.sender = { name: "John Doe", email: "nhoangkiet35@gmail.com" };
sendSmtpEmail.to = [{ email: "1851050073kiet@ou.eduvn", name: "Jane Doe" }];
// sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
// sendSmtpEmail.bcc = [{ email: "John Doe", name: "example@example.com" }];
// sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { parameter: "My param value", subject: "New Subject" };

apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
        console.log(
            "API called successfully. Returned data: " + JSON.stringify(data)
        );
    },
    function (error) {
        console.error(error);
    }
);

const html = `<html>
                <head>
                    <style>
                        table, td, th {  
                            border: 1px solid #ddd;
                            text-align: left;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            padding: 15px;
                        }
                        img {
                            max-width: 7rem;
                        }
                    </style>
                </head>
                        <body >
                            <h1>Xin Chào {{ params.name }}</h1>
                            <div>Phone: {{params.phone}}</div>
                            <div>Address: {{params.address}}</div>
                            <table>
                                <tr>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Hình Ảnh</th>
                                    <th>Giá</th>
                                    <th>Số Lượng</th>
                                    <th>Thành Tiền</th>
                                </tr>
                                {{ params.products.map(item => (
                                    <tr>
                                        <td>{item.product.name}</td>
                                        <td class='img'>{item.product.img1}</td>
                                        <td>{item.product.price} VND</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.product.price * item.quantity} VND</td>
                                    </tr>
                                    ))
                                }}
                            </table>
                            <h1>Tổng Thanh Toán: <br/>{{ params.totalAmount }}</h1>
                            <h1>{{ params.bodyMessage }}</h1>
                        </body>
                    </html >`;
