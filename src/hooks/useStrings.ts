import ptBr from "../locales/pt-br/strings";

export const useStrings = () => {  
  const titles = (title: keyof typeof ptBr.titles) => {
    return ptBr.titles[title]
  }

  const bodies = (body: keyof typeof ptBr.bodies) => {
    return ptBr.bodies[body]
  }

  return { 
    titles,
    bodies
  };
}