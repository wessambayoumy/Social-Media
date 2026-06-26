import z from "zod";
import { sendRequestSchema, processRequestSchema } from "./friend.request.validation";

export type SendRequestDTO = z.infer<typeof sendRequestSchema.body>;
export type ProcessRequestDTO = z.infer<typeof processRequestSchema.body>;
