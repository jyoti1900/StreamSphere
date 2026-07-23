import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {
  SentMessageInfo,
  Options,
} from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<
    SentMessageInfo,
    Options
  >;

  constructor() {
    this.transporter =
      nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  }

  // SEND CONFIRMATION EMAIL
  async sendConfirmationEmail(
    email: string,
    name: string,
  ) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured — skipping confirmation email');
        return;
      }

      await this.transporter.sendMail({
        from: `"StreamSphere" <${process.env.EMAIL_USER}>`,
        to: email,
        subject:
          'Account Created Successfully - Welcome to StreamSphere!',
        html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <p>Hello ${name},</p>

                    <p>
                    Welcome to StreamSphere.
                    Your account has been created successfully.
                    </p>

                    <p>
                    Start watching your favorite movies anytime.
                    </p>

                    <p style="margin-top: 30px;">
                    Thank you,<br />
                    StreamSphere Team
                    </p>
                </div>
                `,
      });

      console.log(
        'Confirmation email sent',
      );
    } catch (error) {
      console.log(
        'Email sending failed:',
        error,
      );
    }
  }

  // SEND FORGOT PASSWORD EMAIL
  async sendForgotPasswordEmail(
    email: string,
    name: string,
    resetLink: string,
  ) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials not configured');
      }

      await this.transporter.sendMail({
        from: `"StreamSphere" <${process.env.EMAIL_USER}>`,
        to: email,
        subject:
          'Reset Your Password - StreamSphere',

        html: `
      <div
        style="
          margin: 0;
          padding: 40px 20px;
          background-color: #0f0f0f;
          font-family: Arial, Helvetica, sans-serif;
          color: #ffffff;
        "
      >

        <div
          style="
            max-width: 600px;
            margin: auto;
            background-color: #1a1a1a;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #2a2a2a;
          "
        >

          <!-- HEADER -->
          <div
            style="
              background-color: #e50914;
              padding: 24px;
              text-align: center;
            "
          >
            <h1
              style="
                margin: 0;
                font-size: 28px;
                color: white;
                letter-spacing: 1px;
              "
            >
              StreamSphere
            </h1>
          </div>

          <!-- BODY -->
          <div style="padding: 40px 32px;">

            <p
              style="
                margin-top: 0;
                font-size: 16px;
                line-height: 1.7;
              "
            >
              Hello ${name},
            </p>

            <p
              style="
                font-size: 15px;
                line-height: 1.8;
                color: #d1d1d1;
              "
            >
              We received a request to reset the password for your
              StreamSphere account.
            </p>

            <p
              style="
                font-size: 15px;
                line-height: 1.8;
                color: #d1d1d1;
              "
            >
              Click the button below to create a new password:
            </p>

            <!-- BUTTON -->
            <div
              style="
                text-align: center;
                margin: 40px 0;
              "
            >
              <a
                href="${resetLink}"
                style="
                  background-color: #e50914;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 32px;
                  border-radius: 8px;
                  font-size: 15px;
                  font-weight: bold;
                  display: inline-block;
                "
              >
                Reset Password
              </a>
            </div>

            <!-- FALLBACK LINK -->
            <p
              style="
                font-size: 13px;
                line-height: 1.7;
                color: #9ca3af;
                word-break: break-all;
              "
            >
              If the button does not work, copy and paste this link into your browser:
              <br /><br />
              <span style="color: #ffffff;">
                ${resetLink}
              </span>
            </p>

            <!-- SECURITY INFO -->
            <div
              style="
                margin-top: 32px;
                padding: 16px;
                background-color: #141414;
                border-left: 4px solid #e50914;
                border-radius: 6px;
              "
            >
              <p
                style="
                  margin: 0;
                  font-size: 13px;
                  line-height: 1.7;
                  color: #cfcfcf;
                "
              >
                • This password reset link may expire after a limited time.<br />
                • If you did not request this password reset, you can safely ignore this email.
              </p>
            </div>

            <!-- FOOTER -->
            <p
              style="
                margin-top: 40px;
                font-size: 15px;
                line-height: 1.7;
                color: #d1d1d1;
              "
            >
              Thank you,<br />
              <strong>StreamSphere Team</strong>
            </p>

          </div>
        </div>

      </div>
      `,
      });

      console.log(
        'Forgot password email sent successfully',
      );
    } catch (error) {
      console.log(
        'Forgot password email failed:',
        error,
      );
      throw error;
    }
  }


  // SEND RESET PASSWORD SUCCESS EMAIL
  async sendResetPasswordSuccessEmail(
    email: string,
    name: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: `"StreamSphere" <${process.env.EMAIL_USER}>`,
        to: email,
        subject:
          'Password Reset Successful - StreamSphere',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                
                <p>Hello ${name},</p>

                <p>
                Your StreamSphere account password has been reset successfully.
                </p>

                <p>
                You can now log in using your new password.
                </p>

                <p>
                If you did not perform this action, please secure your account immediately.
                </p>

                <p style="margin-top: 30px;">
                Thank you,<br />
                StreamSphere Team
                </p>

            </div>
            `,
      });

      console.log(
        'Reset password success email sent',
      );
    } catch (error) {
      console.log(
        'Reset password success email failed:',
        error,
      );
    }
  }

  async sendContactUsEmail(
    name: string,
    email: string,
    subject: string,
    message: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: `"StreamSphere Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Contact Request - ${subject}`,
        html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Form Submission</h2>

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Subject:</strong>
            ${subject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div
            style="
              padding:10px;
              background:#f5f5f5;
              border-radius:5px;
            "
          >
            ${message}
          </div>
        </div>
      `,
      });

      // Auto-reply to user

      await this.transporter.sendMail({
        from: `"StreamSphere" <${process.env.EMAIL_USER}>`,
        to: email,
        subject:
          'Thank you for contacting StreamSphere',
        html: `
        <div style="font-family: Arial, sans-serif;">
          <p>Hello ${name},</p>

          <p>
            Thank you for contacting us.
            We have received your message
            and our team will get back to you soon.
          </p>

          <p>
            Regards,<br/>
            StreamSphere Team
          </p>
        </div>
      `,
      });

      return true;
    } catch (error) {
      console.error(
        'Contact email error:',
        error,
      );
      throw error;
    }
  }
}