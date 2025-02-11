import mongoose from "mongoose";

const RoleSchema = mongoose.Schema({
    role: {
        type: String,
        required: [true, 'El Rol es Obligatorio']
    }
});

export default mongoose.model('Role', RoleSchema);