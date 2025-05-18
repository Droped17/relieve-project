import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils"
import { defaultFieldResolver } from "graphql"

// [TODO]: Check what is graphql-tools/utils do
export const authDirective = (schema) => {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0]
            
            if (authDirective) {
                const { resolve = defaultFieldResolver} = fieldConfig
                const { requires } =  authDirective

                fieldConfig.resolve = async function (source, args, context, info) {
                    if (!context.user) {
                        throw new Error("Not Authenticated")
                    }
                    if (requires && context.user.role !== requires) {
                        throw new Error(`Requires ${requires} role`)
                    }
                    return resolve(source, args, context, info)
                }
            }
            return fieldConfig
        }
    })
}