import { Montserrat, Special_Gothic_Condensed_One } from 'next/font/google'

export const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
})

export const specialGothic = Special_Gothic_Condensed_One({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-special-gothic',
    display: 'swap',
})