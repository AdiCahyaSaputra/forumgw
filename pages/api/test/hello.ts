import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  return res.json({
    message: "Hello",
  });
};

export default handler;
