import {
  Pizza,
  Gamepad2,
  Shirt,
  Gift,
  Car,
  Heart,
  Home,
  Tag,
  Smartphone,
  UtensilsCrossed,
  GraduationCap,   // educação
  Banknote,        // financeiro
  Wrench,          // ferramentas
  Dumbbell,        // esportes / academia
} from 'lucide-react'

export const TAG_ICON_OPTIONS = [
  { value: 'pizza', label: 'Pizza / Restaurantes' },
  { value: 'gamepad', label: 'Games' },
  { value: 'shirt', label: 'Moda' },
  { value: 'gift', label: 'Presentes' },
  { value: 'car', label: 'Automotivo' },
  { value: 'heart', label: 'Beleza / Bem-estar' },
  { value: 'home', label: 'Casa' },
  { value: 'smartphone', label: 'Tecnologia' },
  { value: 'utensils', label: 'Alimentação' },

  // 🔥 NOVOS
  { value: 'education', label: 'Educação' },
  { value: 'finance', label: 'Financeiro' },
  { value: 'tools', label: 'Ferramentas' },
  { value: 'fitness', label: 'Esportes / Academia' },

  { value: 'tag', label: 'Padrão' },
] as const

export function getTagIcon(icon?: string | null) {
  switch (icon) {
    case 'pizza':
      return Pizza
    case 'gamepad':
      return Gamepad2
    case 'shirt':
      return Shirt
    case 'gift':
      return Gift
    case 'car':
      return Car
    case 'heart':
      return Heart
    case 'home':
      return Home
    case 'smartphone':
      return Smartphone
    case 'utensils':
      return UtensilsCrossed

    // 🔥 NOVOS
    case 'education':
      return GraduationCap
    case 'finance':
      return Banknote
    case 'tools':
      return Wrench
    case 'fitness':
      return Dumbbell

    case 'tag':
    default:
      return Tag
  }
}