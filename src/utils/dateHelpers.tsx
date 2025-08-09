// String prototype extension for padLeft (Flutter equivalent)
declare global {
  interface String {
    padLeft(length: number, char: string): string;
  }
}

String.prototype.padLeft = function(length: number, char: string): string {
  return char.repeat(Math.max(0, length - this.length)) + this;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().substring(0, 10);
};

export const formatTime = (hour: number): string => {
  return `${hour.toString().padLeft(2, '0')}:00`;
};

export const getTurkishDate = (date: Date): string => {
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });
};

export const formatTurkishDateTime = (date: Date): string => {
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};