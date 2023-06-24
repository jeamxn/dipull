import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";

const handler = async (req, res) => {
  const id = (await getTokenInfo(req, res))?.id;
  if(!id) {
    res.status(200).json("");
    return;
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const client = await connectToDatabase();
  const usersCollection = client.db().collection("users");
  const { _id, ...userInfo } = await usersCollection.findOne({ 
    id: Number(id)
  });
  const name = `${userInfo.number} ${userInfo.name}`;

  const stayCollection = await client.db().collection("stay");
  const searchMyStayData = await stayCollection.findOne({ name });
  const isStay = searchMyStayData ? true : false;
  let isOuting = false;
  if(isStay) {
    isOuting = searchMyStayData.outing["토요일"].reason.length || searchMyStayData.outing["일요일"].reason.length ? true : false;
  }
  
  const washCollection = client.db().collection("wash");
  const searchMyWashData = await washCollection.findOne({ 
    owner: name,
    date: `${year}-${month}-${day}`
  });
  const isWash = searchMyWashData ? true : false;

  res.status(200).json({
    ...userInfo,
    userInfo: {
      stay: isStay,
      outing: isOuting,
      wash: isWash
    }
  });
};

export default handler;