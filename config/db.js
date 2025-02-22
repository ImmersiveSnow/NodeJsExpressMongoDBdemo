import mongoose from "mongoose"
const uri = process.env.URI

const connectdb = async () => {
  try {
    const connect = await mongoose.connect(uri)
    console.log("Database connection:", connect.connection.host, connect.connection.name)
  } catch (error) {
    throw new Error(`connection to ${uri} failed`)
  }
}

export default connectdb