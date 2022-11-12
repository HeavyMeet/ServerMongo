import { gql } from "apollo-server-express";

export const typeDefs = gql`
    scalar Upload
    type Token {
        token: String
    }

    type Valores {
      ide: Int
      val: String
    }

    type Programas {
        beneficio: [Valores]
        municipio: [Valores]
        periodicidad: [Valores]
        periodo: [Valores]
        programa: [Valores]
    }
    
    type Query {
        obtenerPrograma : Programas
        obtenerCURP : [String]
    }

    input UsuarioInput {
        email: String!
        password: String!
    }

    input BeneficiarioInput {
            period: Int
            program: Int
            curpData: [String]
            muni: Int
            latitud: Float
            longitud: Float
            benef: Int
            cantidad: String
            periodici: Int
            tarjeta: String
            fotox: [String]
        }

    type Mutation {
        multipleUpload(foto: [Upload]) : String
        crearUsuario(input: UsuarioInput) : String
        autenticarUsuario(input: UsuarioInput ) : Token
        nuevoBeneficiario(input: BeneficiarioInput) : String
    }

`;

