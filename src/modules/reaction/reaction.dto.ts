import z from "zod";
import { reactSchema } from "./reaction.validation";

export type ReactDTO = z.infer<typeof reactSchema.body>;
