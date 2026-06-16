import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    issuedBook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required:false
    },
    issuedDate: {
        type: String,
        required: false,
    },
    returnDate: {
        type: String,
        required: false,
    },
    subsrciptionType: {
        type: String,
        required: true
    },
    subsrciptionDate: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String,
        required: false
    },
    passwordResetExpires: {
        type: Date,
        required: false
    },
}, {
    timestamps: true
})

const userModel = mongoose.model("User", userSchema)
export default userModel;