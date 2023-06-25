import { connectToDatabase } from "@/utils/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("stay");
  const rowData = await stayCollection.find({}).sort({name: 1}).toArray();

  const send = {
  };

  const data = rowData.map((row) => {
    return {
      number: Number(row.name.split(" ")[0]),
      name: row.name.split(" ")[1],
      gender: row.gender,
      outing: row.outing
    };
  });

  data.forEach((row) => {
    const _grade = Math.floor(row.number / 1000);
    const _class = Math.floor(row.number / 100) % 10;

    if (!send[_grade]) send[_grade] = { "count": 0 };
    if (!send[_grade][_class]) send[_grade][_class] = {"data": [], count: 0};

    send[_grade][_class].data.push(row);
    send[_grade][_class].count++;
    send[_grade].count++;
  });

  res.status(200).json(send);
};

export default handler;