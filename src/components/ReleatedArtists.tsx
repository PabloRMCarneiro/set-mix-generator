import * as React from "react"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/src/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer"



/* 
desenvolder um card inteiramente dos artistas relacionados a musica que o usuario selecionou como base
a partir dos artistas selecionados por musicas 
requisitar por cada artista os artistas relacionados
fazer uma filtragem se ja existir artista duplicado, limpar no caso
no final, pegar todos os artistas que estão sendo recomendados por artista de cada musica
e no final mesmo reproduzir cada top music de cada artista ( pela api do spotify )



o card no final é pegar todos os artistas que são da musica vigente, e reproduzir um card
com todos os artistas e todas as top musicas requisitadas pelo spotify



--------------------------------------
1 - pegar todos os artistas que são da musica vigente
2 - requisitar do spotify quais são os artistas relacionados
3 - limpar quais são os artistas duplicados
4 - req do spotify quais são as top musicas de todos os artistas
5 - mostrar em cada artistas as top musicas
--------------------------------------
*/

export function ReleatedArtists() {

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
{/*           <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  )
}
