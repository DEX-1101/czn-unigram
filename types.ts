export type Sender = 'user' | 'character' | 'system';

export interface Character {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  characterId?: string; // ID of the character if sender is 'character'
}

export interface ChatConfig {
  activeCharacterId: string;
  characters: Character[];
  backgroundColor: string;
  chatBoxColor: string;
  footerText: string;
  showFooter: boolean;
  headerTitle: string;
  chatWidth: number;
}