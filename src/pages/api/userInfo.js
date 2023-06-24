import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";

const handler = async (req, res) => {
  const id = (await getTokenInfo(req, res)).id;
  if(!id) {
    res.status(200).json("");
    return;
  }
  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

const get = async (req, res, id) => {
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

const post = async (req, res, id) => {
  const {number, name, gender} = req.body;

  if(
    !number || !name || !gender ||
    String(number).length !== 4 ||
    !(1 <= Number(String(number)[0]) && Number(String(number)[0]) <= 3) || 
    !(1 <= Number(String(number)[1]) && Number(String(number)[1]) <= 6) || 
    !(0 <= Number(String(number)[2]) && Number(String(number)[2]) <= 3) ||
    !(0 <= Number(String(number)[3]) && Number(String(number)[3]) <= 9) ||
    String(name).length < 2 || String(name).length > 10 ||
    !(gender === "male" || gender === "female")
  ) {
    res.status(200).json({
      success: false,
      message: "잘못된 요청입니다."
    });
    return;
  }

  const client = await connectToDatabase();
  const usersCollection = await client.db().collection("users");
  //update userInfo
  const update = await usersCollection.updateOne({
    id: Number(id)
  }, {
    $set: {
      number: Number(number),
      name: String(name),
      gender: String(gender)
    }
  });

  if(!update?.acknowledged) {
    res.status(200).json({
      success: false,
      message: "수정에 실패하였습니다."
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "수정되었습니다.",
    update
  });
};

const del = async (req, res, id) => {};


export default handler;