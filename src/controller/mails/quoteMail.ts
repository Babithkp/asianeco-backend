import nodemailer from "nodemailer";const myGmail = process.env.GOOGLE_APP_USER;
const pass = process.env.GOOGLE_APP_PASS;

export const QuoteMailBody = (quoteData: any) => {
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
                mso-hide: all;
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
                                    <p style="padding: 0px; margin: 32px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;>Hi ${quoteData.Client.name},</p>
                                    <p align="left"
                                        style="padding: 0px; margin: 32px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        ${quoteData.mailBody}</p>

                                    <p
                                        style="padding: 0px; margin: 30px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; ">

                                        Quote Number: ${quoteData.quoteId}</p>
                                    <p
                                        style="padding: 0px; margin: 30px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; ">
                                        Total Quote Amount: INR ${quoteData.amount.toFixed(2)}</p>
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
                                        ${quoteData.settings.contactNumber} </p>
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        Website: ${quoteData.settings.website} </p>
                                    <img src="https://shreelnlogistics-bucket.s3.ap-south-1.amazonaws.com/logobillsoft.png"
                                        alt="shreelnlogistics Logo"
                                        style="max-width: 300x; width: 300px; margin: 20px 0px 20px;">
                                    <p
                                        style="padding: 0px; margin: 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                        ${quoteData.settings.address}</p>
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

export const sendQuoteMailToClient = async (
  email: string,
  subject: string,
  body: string,
  attachments: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[]
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: myGmail,
        pass: pass,
      },
    });
    const info = await transporter.sendMail({
      from: `Asian Best Eco Traders <${myGmail}>`,
      to: email,
      subject: subject,
      html: body,
      attachments,
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (e) {
    console.log(e);
  }
};
