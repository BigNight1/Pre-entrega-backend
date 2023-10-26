import CustomError from "./CustomError.js";
import EErrors from "./enums.js";

export const createDBError=(message,cause)=>{
    return CustomError.createError({
        name:"Database Connection Error",
        message,
        code:EErrors.DATABASE_ERROR,
        cause: cause ? cause.message: undefined
    })
}