export const genRamdomId = (): string => {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString()
}
