import {PrismaClient} from "@prisma/client";
import { MongoClient } from "mongodb";

declare global{
      var prisma: PrismaClient | undefined;
};
// for the development phase, i'm only creating a single prisma client as whenever we are going to reload or make any sort of change, the new prisma client would be initialized, in order to avoid that we are using the condition here.
export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') globalThis.prisma = db;