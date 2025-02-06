import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import EmailModel from "@/lib/models/EmailModel";
// const LoadDB = async () => {
//   await ConnectDB();
// };
// LoadDB();
export async function POST(request) {
  try {
    await ConnectDB();
    const formData = await request.formData();
    const emailData = {
      email: formData.get("email"),
      // email: `${formData.get("email")}`,
    };
    await EmailModel.create(emailData);
    return NextResponse.json({
      success: true,
      msg: "Email Subscribed",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Get all emails

export async function GET(request) {
  const emails = await EmailModel.find({});
  return NextResponse.json({ emails });
}

// Creating API Endpoint to delete Blog
export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, msg: "Email Deleted" });
}
