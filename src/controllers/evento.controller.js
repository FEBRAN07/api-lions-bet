import EventoService from "../services/evento.service.js";

async function listarAbertos(req, res, next) {
    try {
        const eventos = await EventoService.listarAbertos();
        return res.status(200).json({ eventos });
    } catch (error) {
        next(error);
    }
}

async function buscarPorId(req, res, next) {
    try {
        const evento = await EventoService.buscarPorId(req.params.id);
        return res.status(200).json({ evento });
    } catch (error) {
        next(error);
    }
}

async function criar(req, res, next) {
    try {
        const evento = await EventoService.criar(req.usuario.id, req.body);
        return res.status(201).json({ evento });
    } catch (error) {
        next(error);
    }
}

async function atualizarOdds(req, res, next) {
    try {
        const mensagem = await EventoService.atualizarOdds(req.params.id, req.body);
        return res.status(200).json({ message: mensagem });
    } catch (error) {
        next(error);
    }
}

async function encerrar(req, res, next) {
    try {
        const { totalApostas, ganhadoras, perdedoras, totalPago } = await EventoService.encerrar(
            req.params.id,
            req.body.resultado
        );
        return res.status(200).json({ totalApostas, ganhadoras, perdedoras, totalPago });
    } catch (error) {
        next(error);
    }
}
const EventoController = {
    listarAbertos,
    buscarPorId,
    criar,
    atualizarOdds,
    encerrar,
};
export default EventoController;
