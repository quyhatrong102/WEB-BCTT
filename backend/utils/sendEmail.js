import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // 1. Tạo Test Account tự động từ Ethereal
    let testAccount = await nodemailer.createTestAccount();

    // 2. Cấu hình transporter (người gửi)
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user, // Ethereal user
        pass: testAccount.pass, // Ethereal password
      },
    });

    // 3. Nội dung email
    const mailOptions = {
      from: '"Fashion Store Admin" <admin@fashionstore.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Fashion Store</h2>
          <p>${options.message}</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #000;">
            ${options.otp}
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">Mã OTP này có hiệu lực trong vòng 5 phút.</p>
        </div>
      `,
    };

    // 4. Gửi email
    const info = await transporter.sendMail(mailOptions);

    console.log("------------------------------------------");
    console.log("Email đã được gửi thành công!");
    console.log("Link mail: %s", nodemailer.getTestMessageUrl(info));
    console.log("------------------------------------------");

  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw new Error('Không thể gửi email, vui lòng thử lại sau.');
  }
};

export default sendEmail;
