import { GraphQLUpload } from 'graphql-upload';
import mongoose from 'mongoose';
import Info from '../models/Info.js';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import path, { parse } from 'path';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {

  const { id, email } = usuario;
  return jwt.sign({ id, email }, secreta, { expiresIn });
}
const Beneficio = mongoose.model('Beneficio', new mongoose.Schema({cve_beneficio: Number,desc_beneficio: String}), 'app_beneficios');
const Municipio = mongoose.model('Municipio', new mongoose.Schema({municipio_id: Number,municipio_desc: String}), 'app_municipios');
const Programa = mongoose.model('Programa', new mongoose.Schema({cve_programa: Number,desc_programa: String}), 'app_programas');
const Periodicidad = mongoose.model('Periodicidad', new mongoose.Schema({cve_periodicidad: Number,desc_periodicidad: String}), 'periodicidad');
const Periodo = mongoose.model('Periodo', new mongoose.Schema({n_periodo: Number,desc_periodo: String}), 'periodos');
const Usuario = mongoose.model('Usuario', new mongoose.Schema({email: String,password: String}), 'usuarios');
export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    obtenerPrograma: async () => {
      try {
        const res = await Beneficio.find({});
        const res1 = await Municipio.find({});
        const res2 = await Programa.find({});
        const res3 = await Periodicidad.find({});
        const res4 = await Periodo.find({});
        let beneficio = [];
        let periodo = [];
        let programa = [];
        let periodicidad = [];
        let municipio = [];
        // console.log(res, " res ")
        for (let i = 0; i < res.length; i++) {
          beneficio.push({ ide: res[i].cve_beneficio, val:res[i].desc_beneficio });
        }
        for (let i = 0; i < res1.length; i++) {
          municipio.push({ ide: res1[i].municipio_id, val:res1[i].municipio_desc });
        }
        for (let i = 0; i < res2.length; i++) {
          programa.push({ ide: res2[i].cve_programa, val:res2[i].desc_programa });
        }
        for (let i = 0; i < res3.length; i++) {
          periodicidad.push({ ide: res3[i].cve_periodicidad, val:res3[i].desc_periodicidad });
        }
        for (let i = 0; i < res4.length; i++) {
          periodo.push({ ide: res4[i].n_periodo, val:res4[i].desc_periodo });
        }
        return { beneficio, municipio, periodo, periodicidad, programa }
      
      } catch (error) {
        throw new Error(error);
      }
    },
    obtenerCURP: async (_, { curpc }) => {
      try {
//        const curps = await Info.find({},{"curp":1,"_id":0});
        const valores = await Info.findOne({curp: curpc},{_id:0, n_periodo:1, cve_programa:1, curp:1, cve_municipio:1, cve_beneficio:1,cantidad: 25, cve_periodicidad:1});
        return valores;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    multipleUpload: async (_, { foto }) => {

      try {
        for (let i = 0; i < foto.length; i++) {
          const { createReadStream, filename, mimetype } = await foto[i];
          const stream = createReadStream();
          let { name } = parse(filename);
          name = name.replace(/([^a-z0-9 ]+)/gi, '-').replace(' ', '_');
          let ext = mimetype.substring(mimetype.indexOf('/') + 1);
          console.log(ext, " ext ")
          //process.on('warning', e => console.warn(e.stack))
          // let pathName = path.join(__dirname, `../imagenes/${name}.${ext}`);
          // pathName = pathName.replace(' ', '_');
          // const out = createWriteStream(pathName);
          // await stream.pipe(out);
        }
        return "Imagenes subidas de manera correcta";
      } catch (e) {
        console.log(e, " error multipleUpload resolver ")
      }
    },
    crearUsuario: async (_, { input }) => {
      const { email, password } = input;

      try {
        const existeUsuario = await Usuario.findOne({ email },{"_id":0});
        
        if(!existeUsuario) {
          throw new Error('El  usuario no esta registrado');
      }
    
        if (existeUsuario.password !== password) {
          throw new Error('La contraseña es incorrecta');
        }

        //Hashear password
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);
        await Usuario.findOneAndUpdate({ email: email }, input);
      
      } catch (error) {
        throw new Error(error);
      }
      return "Usuario Creado Correctamente";

    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      console.log(input, "input ", email, " email ", password, " pass ")
      try {
        const existeUsuario = await Usuario.findOne({ email });
        // si el usuario existe
        if(!existeUsuario) {
            throw new Error('El Usuario no existe');
        }

        // Si el password es correcto
        const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
        if (!passwordCorrecto) {
          throw new Error('Password Incorrecto');
        }

        return {
          token: crearToken(existeUsuario, process.env.SECRETA, '6hr')
        }
      } catch (error) {
        throw new Error(error);
      }
      // Dar acceso a la app
    },
    nuevoBeneficiario: async (_, { input }) => {
      let { period, program, curpData, muni, latitud, longitud, benef, cantidad, periodici,
        tarjeta, fotox } = input;
      const [CURP, , AP, AM, nombres, , fec_nac, , cve_lugar_nac] = curpData;

      cantidad = parseInt(cantidad);
      tarjeta = parseInt(tarjeta);
      try {
        
        const existeUsuario = await Info.findOne({curp: CURP });
        let nom_comp = nombres + ' ' + AP + ' ' + AM;
        const [foto1, foto2] = fotox;
        const inputf = {n_periodo:period, cve_programa:program, primer_apellido:AP, segundo_apellido:AM, nombres, nombre_completo:nom_comp, 
          fecha_nacimiento:fec_nac, curp:CURP, cve_lugar_nacimiento:cve_lugar_nac, cve_municipio:muni, cve_entidad_federativa:cve_lugar_nac,
          latitud, longitud, cve_beneficio:benef, cantidad, cve_periodicidad:periodici, tarjeta, foto1, foto2 }
       
          if (!existeUsuario) {
          const newInfo = new Info(inputf);
          await newInfo.save();
        } else {
          await Info.findOneAndUpdate({ curp: CURP }, inputf);
        }
      } catch (err) {
        console.log(err);
      }
      return "Beneficiario Creado Correctamente";
    }
  }
}


   
