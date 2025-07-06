"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvoiceMailToClient = exports.InvoiceMailBody = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const myGmail = process.env.GOOGLE_APP_USER;
const pass = process.env.GOOGLE_APP_PASS;
const InvoiceMailBody = (invoiceData) => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Details</title>
    <style type="text/css">
        #outlook a {
            padding: 0
        }

        .ExternalClass {
            width: 100%
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%
        }

        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%
        }

        table,
        td {
            mso-table-lspace: 0;
            mso-table-rspace: 0
        }

        img {
            -ms-interpolation-mode: bicubic
        }

        img {
            border: 0;
            outline: none;
            text-decoration: none
        }

        a img {
            border: none
        }

        td img {
            vertical-align: top
        }

        table,
        table td {
            border-collapse: collapse
        }

        body {
            margin: 0;
            padding: 0;
            width: 100% !important
        }

        .mobile-spacer {
            width: 0;
            display: none
        }

        @media all and (max-width:639px) {
            .container {
                width: 100% !important;
                max-width: 600px !important
            }

            .mobile {
                width: auto !important;
                max-width: 100% !important;
                display: block !important
            }

            .mobile-center {
                text-align: center !important
            }

            .mobile-right {
                text-align: right !important
            }

            .mobile-left {
                text-align: left !important;
            }

            .mobile-hidden {
                max-height: 0;
                display: none !important;
                overflow: hidden
            }

            .mobile-spacer {
                width: auto !important;
                display: table !important
            }

            .mobile-image,
            .mobile-image img {
                height: auto !important;
                max-width: 600px !important;
                width: 100% !important
            }
        }
    </style>

</head>

<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table cellpadding="0" cellspacing="0" border="0" width="600" class="main container"
        style="width: 600px; border-collapse: separate;">
        <tbody>
            <tr>
                <td align="left" valign="top" bgcolor="#fff"
                    style="vertical-align: top; line-height: 1; background-color: #ffffff; border-radius: 0px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="block"
                        style="width: 100%; border-collapse: separate;">
                        <tbody>
                            <tr>
                                <td align="left" valign="top" bgcolor="#ffffff"
                                    style="vertical-align: top; line-height: 1; padding: 32px 32px 48px; background-color: #ffffff; border-radius: 0px;">
                                    <p
                                        style="padding: 0px; margin: 30px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        Hi ${invoiceData.Client.name},</p>
                                    <p align="left"
                                        style="padding: 0px; margin: 32px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        ${invoiceData.mailBody}</p>
                                    <p
                                        style="padding: 0px; margin: 30px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        Shipment Details:</p>
                                    <p
                                        style="padding: 0px; margin: 10px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; ">
                                        Invoice#: ${invoiceData.invoiceId}</p>
                                    <p
                                        style="padding: 0px; margin: 10px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; ">
                                        Customer Name: ${invoiceData.Client.name}</p>

                                    <p
                                        style="padding: 0px; margin: 30px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        Warm Regards,
                                    </p>
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        Asian Best Eco Traders</p>
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        CEO </p>
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        Sethu Narayanan</p>
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        ${invoiceData.settings.contactNumber} </p>
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        Website: ${invoiceData.settings.website} </p>
                                    <img src="https://shreelnlogistics-bucket.s3.ap-south-1.amazonaws.com/logobillsoft.png"
                                        alt="shreelnlogistics Logo"
                                        style="max-width: 300x; width: 300px; margin: 20px 0px 20px;"/>
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        ${invoiceData.settings.address}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
</body>

</html>`;
};
exports.InvoiceMailBody = InvoiceMailBody;
const sendInvoiceMailToClient = (email, subject, body, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: myGmail,
                pass: pass,
            },
        });
        const info = yield transporter.sendMail({
            from: `Asian Best Eco Traders <${myGmail}>`,
            to: email,
            subject: subject,
            html: body,
            attachments,
        });
        console.log("Email sent successfully:", info.messageId);
    }
    catch (e) {
        console.log(e);
    }
});
exports.sendInvoiceMailToClient = sendInvoiceMailToClient;
