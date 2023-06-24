import { connectToDatabase } from "@/utils/db";

const fixedData = {

};

const isWeekend = () => {
  const today = new Date();
  const day = today.getDay(); // 일(0) ~ 토(6)까지의 값을 반환

  return day === 0 || day === 6;
};

const stayStates = async () => {
  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("states");
  const {isStay, ...searchStates} = await stayCollection.findOne({});
  
  return {
    isStay: isWeekend() || isStay,
    ...searchStates,
    ...fixedData
  };
};

export default stayStates;
