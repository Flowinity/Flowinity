import { Container, Service } from "typedi"
import { CacheService } from "@app/services/cache.service"
import { User } from "@app/models/user.model"
import { Invite } from "@app/models/invite.model"
import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import { Announcement } from "@app/models/announcement.model"
import { Experiment } from "@app/models/experiment.model"
import { CoreService } from "@app/services/core.service"
import { Feedback } from "@app/models/feedback.model"
import { Upload } from "@app/models/upload.model"
import path from "path"
import * as fs from "fs"
import { Friend } from "@app/models/friend.model"

export enum CacheType {
  "everything",
  "state",
  "collections",
  "sharelinks"
}

const inviteParams = {
  include: [
    {
      model: User,
      as: "user",
      attributes: ["id", "username", "avatar", "email"]
    },
    {
      model: User,
      as: "invited",
      attributes: ["id", "username", "avatar", "email"]
    }
  ],
  attributes: [
    "email",
    "adminId",
    "inviteKey",
    "status",
    "userId",
    "registerUserId",
    "createdAt",
    "updatedAt"
  ]
}

@Service()
export class AdminService {
  constructor(private readonly cacheService: CacheService) {}
  async getFeedback() {
    return await Feedback.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
        }
      ],
      order: [["createdAt", "DESC"]]
    })
  }
  async createAnnouncement(
    content: string,
    userId: number
  ): Promise<Announcement> {
    let announcement = await Announcement.create({
      content,
      userId
    })
    return announcement
  }
  async getInvites() {
    return Invite.findAll({
      ...inviteParams
    })
  }

  async actOnInvite(
    inviteKey: string,
    action: "accepted" | "rejected"
  ): Promise<Invite | null> {
    await Invite.update(
      {
        status: action
      },
      {
        where: {
          inviteKey
        }
      }
    )
    return await Invite.findOne({
      where: {
        inviteKey
      },
      ...inviteParams
    })
  }

  async getUsers() {
    return User.findAll()
  }

  async getStats() {
    //TODO
    return {}
  }

  async purgeCache(type: CacheType) {
    switch (type) {
      case CacheType.everything:
        await this.cacheService.refreshState()
        await this.cacheService.generateCollectionCache()
        await this.cacheService.generateShareLinkCache()
        return true
      case CacheType.state:
        await this.cacheService.refreshState()
        return true
      case CacheType.collections:
        await this.cacheService.generateCollectionCache()
        return true
      case CacheType.sharelinks:
        await this.cacheService.generateShareLinkCache()
        return true
      default:
        return false
    }
  }

  async purgeUserCache(id: number) {
    await this.cacheService.generateCollectionCacheForUser(id)
    return true
  }

  async sendEmail(mail: Mailgen.Content, email: string, subject: string) {
    console.log("[AdminService] Sending email to", email)
    let mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: "TroploPrivateUploader",
        link: "https://images.flowinity.com"
      }
    })
    let emailBody = mailGenerator.generate(mail)
    let emailText = mailGenerator.generatePlaintext(mail)
    let transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.username,
        pass: config.email.password
      }
    })
    // output to html file
    fs.writeFileSync(path.join(__dirname, `../../${subject}.html`), emailBody)
    return await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: subject,
      text: emailText,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; margin: 0 auto; padding: 0; height: 100%; width: 100%;">
<head>
  <meta charset="utf-8"> <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
  <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->

  <!-- Web Font / @font-face : BEGIN -->
  <!-- NOTE: If web fonts are not required, lines 9 - 26 can be safely removed. -->

  <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
  <!--[if mso]>
  <style>
    * {
      font-family: sans-serif !important;
      color: white !important;
    }
  </style>
  <![endif]-->

  <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
  <!--[if !mso]><!-->
  <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
  <!--<![endif]-->

  <!-- Web Font / @font-face : END -->

  <!-- CSS Reset -->
  <style type="text/css">
    .mobile-link--footer a,
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: underline !important;
    }
  </style>

  <!-- Progressive Enhancements -->
  <style>
    .button-td:hover,
    .button-a:hover {
      background: #555555 !important;
      border-color: #555555 !important;
    }
  </style>

</head>
<body width="100%" bgcolor="#151515"
      style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; Margin: 0; margin: 0 auto; padding: 0; height: 100%; width: 100%;"
      dir="ltr">
<center
  style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; width: 100%; background: #151515;">

  <!--
      Set the email width. Defined in two places:
      1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 700px.
      2. MSO tags for Desktop Windows Outlook enforce a 700px width.
  -->
  <div
    style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; max-width: 700px; margin: auto;">
    <!--[if (gte mso 9)|(IE)]>
    <table cellspacing="0" cellpadding="0" border="0" width="600" align="center">
      <tr>
        <td>
    <![endif]-->

    <!-- Email Header : BEGIN -->
    <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
           style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; max-width: 700px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
           bgcolor="#151515">
      <tr
        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
        bgcolor="#151515">
        <td class="branding"
            style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #fff; font-size: 25px; font-family: sans-serif; padding: 30px 0; text-align: center; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
            align="center" bgcolor="#151515">
          <a href="https://images.flowinity.com" target="_blank"
             style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: #fff; text-decoration: none;   font-weight: 500;
  background: -webkit-radial-gradient(#096fea, #0166ea, #0190ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; font-size: 64px;">
            TPU
          </a>
        </td>
      </tr>
    </table>
    <!-- Email Header : END -->

    <!-- Email Body : BEGIN -->
    <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#151515" width="100%"
           style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; max-width: 700px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;">

      <!-- Hero Image, Flush : BEGIN -->

      <tr
        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
        bgcolor="#151515">
        <td
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515; text-align: center;" bgcolor="#151515">
          <p
            style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: white;">
            <img width="600" src="https://i.troplo.com/i/2950e49a89f6.png"
                 alt="Colubrina has a new home! Colubrina to TPU."
                 style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; -ms-interpolation-mode: bicubic; margin-top: -45px">
          </p>
          <h3
            style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; font-size: 26px; text-align: center; color: white;">
            What is TPU?
          </h3>
          <p
            style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: white; margin-left: 20px; margin-right: 20px">
            TPU, originally a simple file hosting service is evolving to house a variety of different services, namely the successor to Colubrina, TPU Communications.
          </p>
        </td>
      </tr>

      <!-- Hero Image, Flush : END -->

      <!-- 1 Column Text + Button : BEGIN -->
      <tr
        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
        bgcolor="#151515">
        <td
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
          bgcolor="#151515">
          <table cellspacing="0" cellpadding="0" border="0" width="100%"
                 style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
                 bgcolor="#151515">
            <tr
              style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
              bgcolor="#151515">
              <td
                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; text-align: center; padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: white; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                align="center" bgcolor="#151515">


                <!-- Dictionary -->


                <!-- Table -->


              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr
        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
        bgcolor="#151515">
        <td
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
          bgcolor="#151515">
          <table cellspacing="0" cellpadding="0" border="0" width="100%"
                 style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
                 bgcolor="#151515">
            <tr
              style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
              bgcolor="#151515">
              <td
                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background: #f8f8f8; text-align: center; padding: 20px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: white; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                align="center" bgcolor="#151515">
                <!-- Action -->
                <h1>Create account</h1>
                <p
                  style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: white;">
                  After creating, you can migrate your Colubrina account with the Migrate Wizard in the sidebar.</p>
                <br style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif;">
                <!-- Button : Begin -->
                <!--[if mso]>
                <center>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                               href="https://images.flowinity.com/register?ref=colubrina"
                               style="height: 45px; v-text-anchor: middle; width: 200px;" arcsize="10%" stroke="f"
                               fillcolor="#0190ea">
                    <w:anchorlock />
                    <center style="color: #ffffff; font-family: sans-serif; font-size: 13px; font-weight: bold;">
                      Create account
                    </center>
                  </v:roundrect>
                </center>
                <![endif]-->
                <![if !mso]>
                <table cellspacing="0" cellpadding="0" border="0" align="center"
                       style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; border-spacing: 10px; margin: auto; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
                       bgcolor="#151515">
                  <tr
                    style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
                    bgcolor="#151515">
                    <td
                      style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; border-radius: 3px; text-align: center; transition: all 100ms ease-in; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                      class="button-td" align="center" bgcolor="#151515">
                      <a href="https://images.flowinity.com/register?ref=colubrina" target="_blank"
                         style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-radius: 3px; display: block; font-family: sans-serif; font-size: 13px; font-weight: bold; line-height: 1.1; padding: 15px; text-align: center; text-decoration: none; transition: all 100ms ease-in; background-color: #0190ea; border-color: #0190ea;"
                         class="button-a">
                        &nbsp;&nbsp;&nbsp;&nbsp;<span
                        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: #ffffff;">Create account</span>&nbsp;&nbsp;&nbsp;&nbsp;
                      </a>
                    </td>
                  </tr>
                </table>
                <![endif]>
                <br style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif;">
                <!-- Button : END -->
              </td>
            </tr>
            <tr
              style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
              bgcolor="#151515">
              <td
                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background: #f8f8f8; text-align: center; padding: 20px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: white; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                align="center" bgcolor="#151515">
                <!-- Action -->
                <h1>Want to learn more?</h1>
                <p
                  style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: white;">
                  Check out the TPU homepage to see what it can offer you.
                </p>
                <br style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif;">
                <!-- Button : Begin -->
                <!--[if mso]>
                <center>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                               href="https://images.flowinity.com"
                               style="height: 45px; v-text-anchor: middle; width: 200px;" arcsize="10%" stroke="f"
                               fillcolor="#0190ea">
                    <w:anchorlock />
                    <center style="color: #ffffff; font-family: sans-serif; font-size: 13px; font-weight: bold;">
                      Home
                    </center>
                  </v:roundrect>
                </center>
                <![endif]-->
                <![if !mso]>
                <table cellspacing="0" cellpadding="0" border="0" align="center"
                       style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; border-spacing: 10px; margin: auto; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
                       bgcolor="#151515">
                  <tr
                    style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
                    bgcolor="#151515">
                    <td
                      style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; border-radius: 3px; text-align: center; transition: all 100ms ease-in; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                      class="button-td" align="center" bgcolor="#151515">
                      <a href="https://images.flowinity.com" target="_blank"
                         style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-radius: 3px; display: block; font-family: sans-serif; font-size: 13px; font-weight: bold; line-height: 1.1; padding: 15px; text-align: center; text-decoration: none; transition: all 100ms ease-in; background-color: #0190ea; border-color: #0190ea;"
                         class="button-a">
                        &nbsp;&nbsp;&nbsp;&nbsp;<span
                        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: #ffffff;">Home</span>&nbsp;&nbsp;&nbsp;&nbsp;
                      </a>
                    </td>
                  </tr>
                </table>
                <![endif]>
                <br style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif;">
                <!-- Button : END -->
              </td>
            </tr>
            <tr
              style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
              bgcolor="#151515">
              <td
                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background: #f8f8f8; text-align: center; padding: 20px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: white; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                align="center" bgcolor="#151515">
                <!-- Action -->
                <h1>Already have an account?</h1>
                <br style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif;">
                <!-- Button : Begin -->
                <!--[if mso]>
                <center>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                               href="https://images.flowinity.com?migrate=colubrina"
                               style="height: 45px; v-text-anchor: middle; width: 200px;" arcsize="10%" stroke="f"
                               fillcolor="#0190ea">
                    <w:anchorlock />
                    <center style="color: #ffffff; font-family: sans-serif; font-size: 13px; font-weight: bold;">
                      Migrate now
                    </center>
                  </v:roundrect>
                </center>
                <![endif]-->
                <![if !mso]>
                <table cellspacing="0" cellpadding="0" border="0" align="center"
                       style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; border-spacing: 10px; margin: auto; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
                       bgcolor="#151515">
                  <tr
                    style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
                    bgcolor="#151515">
                    <td
                      style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; border-radius: 3px; text-align: center; transition: all 100ms ease-in; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                      class="button-td" align="center" bgcolor="#151515">
                      <a href="https://images.flowinity.com?migrate=colubrina" target="_blank"
                         style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-radius: 3px; display: block; font-family: sans-serif; font-size: 13px; font-weight: bold; line-height: 1.1; padding: 15px; text-align: center; text-decoration: none; transition: all 100ms ease-in; background-color: #0190ea; border-color: #0190ea;"
                         class="button-a">
                        &nbsp;&nbsp;&nbsp;&nbsp;<span
                        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: #ffffff;">Migrate now</span>&nbsp;&nbsp;&nbsp;&nbsp;
                      </a>
                    </td>
                  </tr>
                </table>
                <![endif]>
                <br style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif;">
                <!-- Button : END -->
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 1 Column Text + Button : END -->

      <!-- 2 Even Columns : BEGIN -->
      <tr
        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
        bgcolor="#151515">
        <td
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
          bgcolor="#151515">
          <table cellspacing="0" cellpadding="0" border="0" width="100%"
                 style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
                 bgcolor="#151515">
            <tr
              style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
              bgcolor="#151515">
              <td
                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; text-align: center; padding: 30px 40px 20px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: white; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                align="center" bgcolor="#151515">


              </td>
            </tr>

            <tr
              style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
              bgcolor="#151515">
              <td
                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; text-align: center; padding: 0 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: white; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
                align="center" bgcolor="#151515">
                Yours truly,
                <br style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif;">
                TPU (formally Colubrina).
              </td>
            </tr>

          </table>
        </td>
      </tr>
      <!-- Two Even Columns : END -->
    </table>
    <!-- Email Body : END -->


    <!-- Email Footer : BEGIN -->
    <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
           style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; max-width: 700px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; table-layout: fixed; Margin: 0 auto; background-color: #151515;"
           bgcolor="#151515">
      <tr
        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; background-color: #151515;"
        bgcolor="#151515">
        <td class="copyright"
            style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding: 40px 10px; width: 100%; font-size: 12px; font-family: sans-serif; mso-height-rule: exactly; line-height: 18px; text-align: center; color: #888888; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #151515;"
            width="100%" align="center" bgcolor="#151515">
          &copy; 2023 <a href="https://images.flowinity.com" target="_blank"
                         style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: sans-serif; color: #888888; text-decoration: underline;">TroploPrivateUploader</a>.
          All rights reserved.
        </td>
      </tr>
    </table>
    <!-- Email Footer : END -->

    <!--[if (gte mso 9)|(IE)]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </div>
</center>

<!-- Support for Gmail Go-To Actions -->


</body>
</html>`
    })
  }

  async createExperimentOverrides(
    currentExperiments: Experiment[],
    overrides: { [key: string]: string | number | boolean },
    userId: number,
    dev: boolean = false
  ) {
    const experiments = Object.entries(overrides).reduce(
      (acc, [name, value]) => {
        try {
          if (name === "meta") return acc
          const val = JSON.parse(<string>value)
          if (val !== currentExperiments[name] && value !== "destroy") {
            acc[name] = val
          }
          return acc
        } catch {
          if (value !== currentExperiments[name] && value !== "destroy") {
            acc[name] = value
          }
          return acc
        }
      },
      {}
    )
    const experimentsToDelete = Object.entries(overrides).reduce(
      (acc, [name, value]) => {
        if (value === "destroy") {
          acc.push(name)
        }
        return acc
      }
    )
    for (const experiment of experimentsToDelete) {
      await Experiment.destroy({
        where: {
          key: experiment,
          userId
        }
      })
    }

    for (const [key, value] of Object.entries(experiments)) {
      await Experiment.create({
        key,
        value: JSON.stringify(value),
        userId
      })
    }
    const coreService = Container.get(CoreService)
    return await coreService.getUserExperiments(userId, dev)
  }

  async exportCSVUploads() {
    let uploads = await Upload.findAll({
      attributes: ["createdAt", "id"],
      order: [["createdAt", "DESC"]],
      raw: true
    })

    let data = uploads.reduce((acc, upload) => {
      const date = dayjs(upload.createdAt).format("YYYY-MM-DD")
      if (date === "Invalid Date") return acc
      if (!acc[date]) {
        acc[date] = 1
      } else {
        acc[date]++
      }
      return acc
    })

    return Object.entries(data)
      .map(([date, count]) => `${date},${count}`)
      .join("\n")
  }

  async getServices() {
    // get all typedi service functions
    const container = Container as any
    const services = container?.globalInstance?.services
    if (!services) return []
    const serviceNames = Object.keys(services)
    const serviceFunctions = serviceNames.map((name) => {
      return services[name]
    })
    // get all typedi service names
    let serviceNamesWithTypes = serviceFunctions.map((service) => {
      return {
        name: service.type.name,
        functions: [] as (string[] | null)[]
      }
    })
    for (const service of serviceNamesWithTypes) {
      // contains controller, application or server
      if (
        service.name.toLowerCase().includes("controller") ||
        service.name.toLowerCase().includes("application") ||
        service.name.toLowerCase().includes("server")
      )
        continue
      const name =
        service.name.charAt(0).toLowerCase() +
        service.name.slice(1).replace("Service", ".service")
      const file = fs.readFileSync(
        path.join(__dirname, `../../app/services/${name}.ts`),
        "utf8"
      )
      // get the function names and also provide the parameters like {"name": "yes", "params": {"id": "number"}}]}
      let functionNames
      try {
        functionNames = file
          .split("\n")
          .filter((line) => line.includes("async"))
          .map((line) => {
            const functionName = line.split("async ")[1].split("(")[0]
            const params = line
              .split("(")[1]
              .split(")")[0]
              .split(",")
              .map((param) => {
                const name = param.split(":")[0]?.trim()
                const type = param.split(":")[1]?.trim()
                return {
                  name,
                  type
                }
              })
            return {
              name: functionName,
              params
            }
          })
      } catch {}
      if (!functionNames) continue
      // @ts-ignore
      service.functions = functionNames
    }
    return serviceNamesWithTypes
  }

  //dev
  async devAcceptFriends() {
    await Friend.update(
      {
        status: "accepted"
      },
      {
        where: {}
      }
    )
  }
}
