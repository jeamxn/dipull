import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";

const handler = async (req, res) => {
  const id = (await getTokenInfo(req, res))?.id;
  if(!id) {
    res.status(200).json("");
    return;
  }

  const client = await connectToDatabase();
  const collection = client.db().collection("users");
  const { _id, ...rest } = await collection.findOne({ 
    id: Number(id)
  });

  res.status(200).json(rest);
};

export default handler;