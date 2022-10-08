const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ntnguyen710",
  api_key: "993986255736253",
  api_secret: "PlezvXXuVPeLZTW_QJtXXfMY31E",
});

export function DeleteImage(image: string) {
  const urlSplit = image.toString().split("/");
  const urlImage = urlSplit?.[urlSplit.length - 1].split(".")[0] || "";
  cloudinary.uploader.destroy(urlImage, function (result: any, err: any) {
    console.log(err);
  });
}
