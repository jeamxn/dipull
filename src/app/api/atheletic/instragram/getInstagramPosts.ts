import axios from "axios";
export const getInstagramPosts = async () => {
  const tag_name = process.env.NEXT_PUBLIC_INSTA_TAG || "";

  const csrf_response = await axios.get(`https://www.instagram.com/explore/tags/${tag_name}`, {
    headers: {
      "Referer": "https://www.instagram.com/",
    }
  });
  const csrf_token = csrf_response.headers?.["set-cookie"]?.[0].split(";")[0].split("=")[1];
  const response = await axios.get("https://www.instagram.com/api/v1/tags/logged_out_web_info", {
    params: {
      "tag_name": tag_name
    },
    headers: {
      "Referer": "https://www.instagram.com/explore/tags/lck/",
      "Cookie": `csrftoken=${csrf_token}`,
      "X-IG-App-ID": "936619743392459",
    }
  });

  const data = response.data.data.hashtag.edge_hashtag_to_media.edges.map((v: any) => {
    try{
      const time = v.node.taken_at_timestamp;
      const date = new Date(time * 1000);
      return {
        id: v.node.shortcode,
        thumbnail: v.node.thumbnail_src,
        time: date,
        like: v.node.edge_liked_by.count,
        comment: v.node.edge_media_to_comment.count,
        text: v.node.edge_media_to_caption.edges[0]?.node.text || "",
      };
    }
    catch{
      return null;
    }
  }).filter((v: any) => v !== null);

  return data;
};