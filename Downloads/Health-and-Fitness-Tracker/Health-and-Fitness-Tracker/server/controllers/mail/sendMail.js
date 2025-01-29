import nodemailer from "nodemailer";

import ForgetPassword_TEMPLATE from "./forgetPassword.js";
import DoctorCreated_TEMPLATE from "./doctorCreated.js";
import TrainerCreated_TEMPLATE from "./trainerCreated.js";
import ClientApproved_TEMPLATE from "./clientApproved.js";
import ClientRejected_TEMPLATE from "./clientRejected.js";
import PasswordChange_TEMPLATE from "./passwordChange.js";
import AppointmentBooked_TEMPLATE from "./appointmentBooked.js";
import AppointmentCanceled_TEMPLATE from "./appointmentCanceled.js";
import AppointmentConfirmed_TEMPLATE from "./appointmentConfirmed.js"

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "timesnowindia21@gmail.com",
    pass: "gyfm ljdl pgpv xkyh",
  },
});

var templates = {
    "forget-password": ForgetPassword_TEMPLATE,
    "doctor-created": DoctorCreated_TEMPLATE,
    "trainer-created": TrainerCreated_TEMPLATE,
    "client-approved": ClientApproved_TEMPLATE,
    "client-rejected": ClientRejected_TEMPLATE,
    "password-change": PasswordChange_TEMPLATE,
    "appointment-booked": AppointmentBooked_TEMPLATE,
    "appointment-cancelled": AppointmentCanceled_TEMPLATE,
    "appointment-confirmed": AppointmentConfirmed_TEMPLATE,
}

const SENDMAIL = async (type, receiver, subject, oneLineMsg, mailContetns, callback) => {
    const options = {
        from: "Health and Fitness Tracker <no-reply@healthandfitnesstracker.com>",
        to: receiver,
        subject: subject,
        text: oneLineMsg,
        html: templates[type](mailContetns),
    }

    try {
        const info = await transporter.sendMail(options)
        callback(info);
    } catch (error) {
        console.log(error);
    } 
};

export default SENDMAIL;