import { TOOL_METADATA_KEY } from "./constants.js";
import { z } from "zod";

export interface ToolMetadata {
    name?: string;
    description: string;
    parameters?: z.ZodTypeAny;
}

export const Tool = (descriptionOrOptions: string | ToolMetadata, options?: Omit<ToolMetadata, 'description'>): MethodDecorator => {
    const value: ToolMetadata = typeof descriptionOrOptions === 'string' ? ({
        description: descriptionOrOptions,
        ...(options ? options : {})
    }) : descriptionOrOptions

    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor | undefined) => {
        if (descriptor) {
            Reflect.defineMetadata(TOOL_METADATA_KEY, value, descriptor.value);
            return descriptor;
        }
        Reflect.defineMetadata(TOOL_METADATA_KEY, value, target);
        return target;
    }
};