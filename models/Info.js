import mongoose from 'mongoose';

const InfoSchema = new mongoose.Schema({
    n_periodo: {
        type: Number,
        required: true,
        trim: true
    },
    cve_programa: {
        type: Number,
        required: true,
        trim: true
    },
    primer_apellido: {
        type: String,
        required: true,
        trim: true
    },
    segundo_apellido: {
        type: String,
        required: true,
        trim: true
    },
    nombres: {
        type: String,
        required: true,
        trim: true
    },
    nombre_completo: {
        type: String,
        required: true,
        trim: true
    },
    fecha_nacimiento: {
        type: String,
        required: true,
        trim: true
    },
    curp: {
        type: String,
        required: true,
        trim: true
    },
    cve_lugar_nacimiento: {
        type: Number,
        required: true,
        trim: true
    },
    cve_municipio: {
        type: Number,
        required: true,
        trim: true
    },
    cve_entidad_federativa: {
        type: Number,
        required: true,
        trim: true
    },
    latitud: {
        type: mongoose.Decimal128,
        trim: true
    },
    longitud: {
        type: mongoose.Decimal128,
        trim: true
    },
    cve_beneficio: {
        type: Number,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true,
        trim: true
    },
    cve_periodicidad: {
        type: Number,
        required: true,
        trim: true
    },
    tarjeta: {
        type: Number,
        required: true,
        trim: true
    },
    foto1: {
        type: String,
        required: true,
        trim: true
    },
    foto2: {
        type: String,
        required: true,
        trim: true
    }
    }, 
    {
        timestamps: true
    }
);

const Info = mongoose.model('Info', InfoSchema);
export default Info;

