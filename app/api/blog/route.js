import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";

import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
const fs = require("fs");
//API Endpoint to get all Blogs
export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  } else {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs });
  }
}

//Api Endpoint for Uplaoding Blogs
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type");
    // Validate content type
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }
    await ConnectDB();
    const formData = await request.formData();
    const image = formData.get("image");
    if (!image || typeof image.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Invalid or missing image file" },
        { status: 400 }
      );
    }
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const timestamp = Date.now();
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: imgUrl,
      authorImg: formData.get("authorImg"),
    };

    await BlogModel.create(blogData);
    console.log("Blog Added");

    return NextResponse.json({
      success: true,
      msg: "Blog Added",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Creating API Endpoint to delete Blog
export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => {});
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Blog Deleted" });
}
