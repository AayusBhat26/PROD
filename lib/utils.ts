import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// cn function overrides the default implementation styles, whenever we want to have a conditional sytling we will use the cn function.