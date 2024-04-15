import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI, { autoIndex: true });
		console.log("Connected to DB");
	} catch (err) {
		console.error("Failed to connect to DB", err.message);
		process.exit(1);
	}
};

export default connectDB;
