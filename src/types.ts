export type AbilityName = 'Mobility' | 'Technique' | 'Survivability' | 'Power' | 'Energy'

export interface CharacterAbility {
  abilityName: AbilityName
  abilityScore: number
}

export interface CharacterTag {
  slot: number
  tag_name: string
}

export interface Character {
  id: number
  name: string
  quote: string
  image: string
  thumbnail: string
  universe: string
  abilities: CharacterAbility[]
  tags: CharacterTag[]
}

export interface CharacterTableData {
  character: {
    id: number
    name: string
    thumbnail: string
  }
  tags: CharacterTag[]
  mobility: number | string
  technique: number | string
  survivability: number | string
  power: number | string
  energy: number | string
  
}
