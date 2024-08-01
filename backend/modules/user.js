import mongoose from "mongoose";

// make scheme
const scheme = mongoose.Schema(
      {
            name:{
                  type: String,
                  required: true,
            },
            age:{
                  type: String,
                  required: true,
            },
            gender:{
                  type: String,
                  required: true,
            }

      }

)
export const USER = mongoose.model("USER",scheme)