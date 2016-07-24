namespace Graphs {
  export class Triple {
    s: string
    p: string
    o: string
    
    constructor(s: string, p: string, o: string) {
      this.s = s;
      this.p = p;
      this.o = o;
    }

    equals(other: Triple): boolean {
      return (this.s == other.s && this.p == other.p && this.o == other.o);
    }

    getNodeAtPosition(position: string): string {
      if (position == 's') return this.s;
      if (position == 'p') return this.p;
      if (position == 'o') return this.o;
      return '';
    }

    setNodeAtPosition(position: string, value: string) {
      if (position == 's') this.s = value;
      if (position == 'p') this.p = value;
      if (position == 'o') this.o = value;
    }

    toString(): string {
      return this.s+' '+this.p+' '+this.o;
    }
  }
}
