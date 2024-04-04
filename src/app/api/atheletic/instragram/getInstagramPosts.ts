import axios from "axios";
export const getInstagramPosts = async () => {
  const response = await axios.get("https://www.instagram.com/api/v1/tags/web_info/", {
    params: {
      "tag_name": process.env.INSTA_TAG || "",
    },
    headers: {
      "Referer": "https://www.instagram.com/explore/tags/lck/",
      "Cookie": `ds_user_id=${process.env.INSTA_DS_USER_ID || ""}; sessionid=${process.env.INSTA_SESSIONID || ""}; `,
      "X-IG-App-ID": process.env.INSTA_APP_ID || "",
    }
  });

  const data = response.data.data.top.sections.map((v1: any) => {
    const vv = v1?.layout_content;
    let v3 = null;
    if(vv.one_by_two_item){
      v3 = vv.one_by_two_item.clips.items;
    }
    else if(vv.medias){
      v3 = vv.medias;
    }
    return v3;
  }).flat().map((v: any) => {
    const v22 = v.media;
    const unix_utc_time = v22.caption.created_at_utc;
    const date = new Date(unix_utc_time * 1000);
    const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    const images = v22.carousel_media ? v22.carousel_media.map((v2: any) => v2.image_versions2.candidates[0].url) : [v22.image_versions2.candidates[0].url];
  
    return { 
      username: v22.caption.user.username,
      name: v22.caption.user.full_name,
      content: v22.caption.text,
      profileImage: v22.caption.user.hd_profile_pic_versions[0].url,
      image: images,
      time: kstDate,
    };
  });

  return data;
};