import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema(
    {
        mandante: {
            type: String,
            required: true,
            trim: true,
        },
        visitante: {
            type: String,
            required: true,
            trim: true,
        },
        oddMandante: {
            type: Number,
            required: true,
            min: [1.01, 'Odd invalida.'],
        },
        oddEmpate: {
            type: Number,
            required: true,
            min: [1.01, 'Odd invalida.'],
        },
        oddVisitante: {
            type: Number,
            required: true,
            min: [1.01, 'Odd invalida.'],
        },
        status: {
            type: String,
            enum: ['aberto', 'encerrado'],
            default: 'aberto',
        },
        resultado: {
            type: String,
            enum: ['mandante', 'empate', 'visitante'],
        },
        criadoPor: {
            type: mongoose.Types.ObjectId,
            ref: 'Usuario',
        },
    },
    { timestamps: true }
);

const Evento = mongoose.model('Evento', eventoSchema);
export default Evento;
