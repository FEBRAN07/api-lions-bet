import mongoose from "mongoose";

const apostaSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Types.ObjectId,
            ref: "Usuario",
            required: true,
        },
        evento: {
            type: mongoose.Types.ObjectId,
            ref: "Evento",
            required: true,
        },
        palpite: {
            type: String,
            required: true,
            enum: ["mandante", "empate", "visitante"],
        },
        valor: {
            type: Number,
            required: true,
            min: [0.01, "O valor deve ser maior que zero"],
        },
        oddNaAposta: {
            type: Number,
            required: true,
        },
        retornoPotencial: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["pendente", "ganha", "perdida"],
            default: "pendente",
        },
    },
    { timestamps: true }
);

const Aposta = mongoose.model("Aposta", apostaSchema);
export default Aposta;
