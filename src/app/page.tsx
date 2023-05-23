'use client'

import { ChakraProvider } from '@chakra-ui/react'
import {theme} from "../chakra/theme"

export default function Home() {
  return (
    <ChakraProvider theme={theme}>
      Homepage
    </ChakraProvider>
  )
}
