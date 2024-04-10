import { connectToDatabase } from "./db";

export const getStates = async (type: string) => {
  try{
    const client = await connectToDatabase();
    const statesCollection = client.db().collection("states");
    const states = await statesCollection.findOne({ type });
    return states?.data;
  }
  catch {
    return "";
  }
};