import {type RequestHandler} from "@sveltejs/kit";
import {zfd} from "zod-form-data";
import {requireAuth} from "$lib/server/auth";
import {getError, getScaledSizes, isImage} from "$lib/server/util";
import z from "zod";
import sharp from "sharp";
import {writeFile} from "$lib/server/fileservices";
import {prisma} from "$lib/server/db";

export const POST: RequestHandler = async (event) => {
  const {user,} = requireAuth(event);
  const formData = await event.request.formData();
  const {success, data, error,} = uploadFileSchema.safeParse(formData);
  if (!success) {
    const errs = z.treeifyError(error);
    return Response.json({success: false, image: getError(errs.properties?.image),}, {status: 400,});
  }
  if (!isImage(data.image)) {
    return Response.json({success: false, icon: "Not an image",}, {status: 400,});
  }
  try {
    let img = sharp(await data.image.bytes());
    img = img.resize(await getScaledSizes(128, img));
    const id = await prisma.$transaction(async tx => {
      const image = await tx.imageStore.create({
        data: {
          fileName: data.image.name,
          fileType: data.image.type,
          creatorId: user.id,
        },
      });
      await writeFile(image.id, await img.png().toBuffer());
      return image.id;
    });
    return new Response(JSON.stringify({image: id,}), {headers: {"Content-Type": "application/json",},});
  } catch (error) {
    console.error(error);
    return Response.json({message: "Internal server error",}, {status: 500,});
  }
};

const uploadFileSchema = zfd.formData({
  image: zfd.file(),
  //
});
