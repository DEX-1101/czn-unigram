import { Message, ChatConfig, Character } from './types';

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char_rei',
    name: 'Rei',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/rei.webp'
  },
  {
    id: 'char_renoa',
    name: 'Renoa',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/reona.webp'
  },
  {
    id: 'char_haru',
    name: 'Haru',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/haru.webp'
  },
  {
    id: 'char_luke',
    name: 'Luke',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/luke.webp'
  },
  {
    id: 'char_khalipe',
    name: 'Khalipe',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/khalipe.webp'
  },
  {
    id: 'char_hugo',
    name: 'Hugo',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/hugo.webp'
  },
  {
    id: 'char_magna',
    name: 'Magna',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/magna.webp'
  },
  {
    id: 'char_veronica',
    name: 'Veronica',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/veronica.webp'
  },
  {
    id: 'char_meilin',
    name: 'Mei Lin',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/meilin.webp'
  },
  {
    id: 'char_kayron',
    name: 'Kayron',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/kyaron.webp'
  },
  {
    id: 'char_orlea',
    name: 'Orlea',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/orlea.webp'
  },
  {
    id: 'char_rin',
    name: 'Rin',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/rin.webp'
  },
  {
    id: 'char_chizuru',
    name: 'Chizuru',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/chizuru.webp'
  },
  {
    id: 'char_yuki',
    name: 'Yuki',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/yuki.webp'
  },
  {
    id: 'char_sereniel',
    name: 'Sereniel',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/sereniel.webp'
  },
  {
    id: 'char_mika',
    name: 'Mika',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/mika.webp'
  },
  {
    id: 'char_owen',
    name: 'Owen',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/ntr_king.webp'
  },
  {
    id: 'char_maribell',
    name: 'Maribell',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/maribell.webp'
  },
  {
    id: 'char_beryl',
    name: 'Beryl',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/berly.webp'
  },
  {
    id: 'char_lucas',
    name: 'Lucas',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/lucas.webp'
  },
  {
    id: 'char_cassius',
    name: 'Cassius',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/cassius.webp'
  },
  {
    id: 'char_amir',
    name: 'Amir',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/amir.webp'
  },
  {
    id: 'char_nia',
    name: 'Nia',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/nia.webp'
  },
  {
    id: 'char_tressa',
    name: 'Tressa',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/tressa.webp'
  },
  {
    id: 'char_selena',
    name: 'Selena',
    avatar: 'https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/selena.webp'
  }
];

export const INITIAL_CONFIG: ChatConfig = {
  activeCharacterId: 'char_renoa',
  characters: INITIAL_CHARACTERS,
  backgroundColor: '#0f172a', // Default slate-900
  chatBoxColor: 'rgb(200, 200, 200)', // Default gray opaque
  footerText: 'The conversation has ended.',
  showFooter: false,
  headerTitle: 'Renoa',
  chatWidth: 580,
};

export const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'character',
    characterId: 'char_renoa',
    text: 'Welcome to Unigram, Captain!'
  },
  {
    id: '2',
    sender: 'character',
    characterId: 'char_renoa',
    text: "I'm here to help you get started. Did you know you can edit any message?"
  },
  {
    id: '3',
    sender: 'character',
    characterId: 'char_renoa',
    text: 'Simply double-click on a chat bubble to change the text directly!'
  },
  {
    id: '4',
    sender: 'character',
    characterId: 'char_renoa',
    text: 'And if you want to delete a message, just hover over it and click the trash icon.'
  },
  {
    id: '5',
    sender: 'character',
    characterId: 'char_renoa',
    text: "That's it! Have fun creating your story, Captain."
  }
];