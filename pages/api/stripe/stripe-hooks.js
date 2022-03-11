const handler = async (req, res) => {
  console.log("event recieved");

  res.send({ received: true });
};

export default handler;
