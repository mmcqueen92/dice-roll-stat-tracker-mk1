export default interface DiceRollData {
  characterId?: number;
  diceSize: number;
  rollType?: string;
  skillType?: string;
  rollValue: number;
  success?: boolean; 
}
