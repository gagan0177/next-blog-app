import mongoose from "mongoose";

export const ConnectDB = async () => {
  mongoose
    .connect(
      "mongodb+srv://gagansingh0177:Gagan0177@cluster0.60wsx.mongodb.net/blog-app",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // 5 seconds
        connectTimeoutMS: 10000, // 10 seconds
      }
    )
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB Atlas:", err);
      setTimeout(connectWithRetry, 5000); // Retry in 5 seconds
    });
  console.log("DB Connected");
};

ConnectDB();
