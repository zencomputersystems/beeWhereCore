/**
 * Declare nodemailer
 */
var nodemailer = require('nodemailer');
/**
 * Declare smtpTransport
 */
var smtpTransport = require('nodemailer-smtp-transport');
/**
 * Declare handlebars
 */
var handlebars = require('handlebars');
/**
 * Declare fs
 */
var fs = require('fs');

export class EmailNodemailerService {
  public mailProcessRaiseRequest([adminName, emailAdmin, emailUser, senderName]: [string, string[], string, string]) {
    smtpTransport = this.createSMTP();

    var replacements = {
      product_name: 'beeWhere',
      url_image: "https://www.beesuite.app/wp-content/uploads/2020/07/bee04.png",
      url_app: "a.beesuite.app",
      user_name: senderName
    };
    var from = process.env.SMTPSENDER;//'wantan.wonderland.2018@gmail.com';
    var emailTosend = emailAdmin;
    var subject = replacements.product_name + ' Raise Request';

    let data = {};
    data['replacement'] = replacements;
    data['from'] = from;
    data['emailTosend'] = emailTosend;
    data['subject'] = subject;

    let dataRes = this.readHTMLFile('src/common/email-templates/raiserequest.html', this.callbackReadHTML(data));

    const fs = require('fs');

    // append data to a file
    fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(data), (err) => {
      if (err) {
        throw err;
      }
    });

    return "success";
  }

  /**
       * Setup and send email
       *
       * @memberof EmailNodemailerService
       */
  public callbackReadHTML = (data) => async function (err, html) {

    var template = handlebars.compile(html);
    // var replacements = {
    //     email: email,
    //     code: "#" + name,
    //     name: name
    // };
    var htmlToSend = template(data.replacement);
    var mailOptions = {
      from: data.from, // 'wantan.wonderland.2018@gmail.com',
      to: data.emailTosend, // email,
      subject: data.subject, // 'Leave approval ✔',
      html: htmlToSend
    };

    return await smtpTransport.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        return await error;
      } else {
        console.log(info);
        const fs = require('fs');
        fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(info), (err) => {
          if (err) {
            throw err;
          }
        });
        return await info;
      }
    });
  }

  /**
     * Method read html file
     *
     * @memberof EmailNodemailerService
     */
  public readHTMLFile = function (path, callback) {
    return fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      }
      else {
        callback(null, html);
      }
    });
  };

  /**
   * Setup smtp data
   *
   * @returns
   * @memberof EmailNodemailerService
   */
  public createSMTP() {
    smtpTransport = nodemailer.createTransport({
      host: process.env.SMTPHOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTPPORT) || 587,
      secure: JSON.parse(process.env.SMTPSECURE) || false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTPUSER || 'casimir.mcglynn@ethereal.email',
        pass: process.env.SMTPPASSWORD || 'GYSA4r14EQRPB9guAK'
      }
    });
    return smtpTransport;
  }

}