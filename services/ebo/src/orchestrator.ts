import { think } from "./brain"

export async function handleRequest(input: string) {
  return think(input)
}