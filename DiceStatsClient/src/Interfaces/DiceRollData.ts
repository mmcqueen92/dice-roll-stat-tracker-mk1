export default interface DiceRollData {
  diceRollId?: number;
  characterId?: number;
  diceSize: number;
  rollType?: string;
  skillType?: string;
  rollValue: number;
  success?: boolean | null;
  timestamp?: string;
  character?: any;
}
