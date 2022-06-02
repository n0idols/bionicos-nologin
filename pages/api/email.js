const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  console.log(req.body.order);

  const order = req.body.order;

  const message = `
    Subtotal: ${order.subtotal},
    Tax: ${order.tax},
    Total: ${order.total},
  `;

  await mail.send({
    to: "scottjames48@gmail.com",
    from: "hola@bionicosjuicesrios.com",
    subject: "Thank you for your order",
    text: message,
    html: message.replace(/\r\n/g, "<br>"),
  });

  res.status(200).json({ status: "Ok" });
}
