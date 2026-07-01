import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, "O nome é obrigatório."],
            trim: true,
            minlength: [2, "O nome deve ter pelo menos 2 caracteres."],
        },
        tipo: {
            type: String,
            enum: ["usuario", "admin"],
            default: "usuario",
        },
        email: {
            type: String,
            required: [true, "O email é obrigatório."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Email inválido."],
        },
        saldo: {
            type: Number,
            default: 0,
            min: [0, "O saldo não pode ser negativo"],
        },
        senhaHash: {
            type: String,
            required: [true, "A senhaHash é obrigatória."],
            select: false,
        },
    },
    {
        timestamps: true,

        toJSON: {
            transform(document, retorno) {
                delete retorno.senhaHash;

                delete retorno.__v;

                return retorno;
            },
        },
    }
);

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
