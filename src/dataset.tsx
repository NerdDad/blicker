import { Dispatch, SetStateAction } from "react";
import verses from "../data/verses.json";

export class DatasetItem {
  x = -20;
  y = 20;
  h = 0;
  w = 0;
  visible = false;
  base: string = "";
  cost = 0;
  active = false;
  misses = new Set();
  constructor(public set: Dataset, public pos: number, public text: string) {
    this.active = /[a-zA-Z]/.test(text);
    if (this.active) {
      this.base = text.toLowerCase()[0];
    }
  }

  markLetter(source: string) {
    if (source === this.base) {
      this.visible = true;
    } else {
      this.misses.add(this.set.info.hand[0]);
    }
  }

  handleClick = (e: React.MouseEvent<SVGTextElement>) => {
    if (this.active && !this.visible && this.set) {
      this.markLetter(this.set.info.hand[0]);
      this.set.shuffleHand(this.base);
    }
    e.stopPropagation();
    return false;
  };

  show() {
    return !this.active || this.visible;
  }

  isPossible(source: string) {
    return this.active && !this.visible && !this.misses.has(source);
  }

  cell() {
    const { info } = this.set;
    const possible = info.hand.length > 0 && !this.misses.has(info.hand[0]);

    const gcolor = possible ? "#11ff11" : `rgb(150,70,70)`;
    return (
      <>
        <rect
          x={this.x}
          y={this.y - this.h + 4}
          width={this.w}
          height={this.h}
          fill={this.show() ? "#00000000" : gcolor}
          strokeWidth={1}
          stroke={"#ddddff"}
          key={this.pos}
        />
        <text
          fill={this.show() ? "black" : "#00000000"}
          x={this.x}
          y={this.y}
          width={this.w}
          data-pos={this.pos}
          onClick={this.handleClick}
          key={`text${this.pos}`}
        >
          {this.text}
        </text>
      </>
    );
  }
}

export class DatasetInfo {
  drops: number = 0;
  dropRate: number = 1000;
  dropStep: number = 1;
  hand = ["a"];
  update(duration: number) {
    this.drops += duration / this.dropRate;
    return this.drops;
  }
}

export class Dataset {
  items: DatasetItem[] = [];
  info: DatasetInfo = new DatasetInfo();

  constructor(public setDrops: Dispatch<SetStateAction<number>>) {
    const s = verses.john[0][0];
    let x = 5;
    let y = 20;
    this.items = Array(s.length)
      .fill(0)
      .map((_, pos) => {
        const item = new DatasetItem(this, pos, s[pos]);
        const blank = item.text === " ";
        item.x = x;
        item.y = y;
        item.w = blank ? 0 : 9.75;
        item.h = 18.12;
        if (blank && x > 300) {
          y += 20;
          x = 5;
        } else {
          x += blank ? 5 : 9.75;
        }
        return item;
      });
    this.info.hand = this.items
      .map((i) => i.base)
      .filter((c) => c !== "")
      .sort();
  }

  render() {
    return (
      <>
        {this.items.map((item) => item.cell())}
        {this.info.hand.slice(0, 15).map((char, index) => {
          const c = Math.max(20 * index, 0);
          return (
            <text
              fill={`rgb(${c},${c},${c})`}
              x={index * 20 + 200}
              y={145}
              width={9.75}
              key={`hand${index}`}
            >
              {char}
            </text>
          );
        })}
      </>
    );
  }

  shuffleHand(target: string) {
    const source = this.info.hand.shift();
    if (!source) return;
    if (source !== target) {
      const pos = Math.min(randInt(5) + 5, this.info.hand.length);
      this.info.hand.splice(pos, 0, source);
    } else {
      // bonus hits
      this.items.filter((c) => c.isPossible(source)).forEach(this.bonusHit);
    }
  }

  bonusHit = () => {
    if (this.info.hand.length <= 0) return;
    const source = randFrom(this.info.hand.slice(0, 10));
    const possibleCells = this.items.filter(
      (c) => c.isPossible(source) && c.base !== source
    );
    const cell = randFrom(possibleCells);
    if (!cell) return;
    cell.misses.add(source);
  };

  update(duration: number) {
    const newDrops = this.info.update(duration);
    this.setDrops(newDrops);
  }

  handleDropClick = () => {
    this.info.drops += this.info.dropStep;
  };
}

function randInt(x: number) {
  return Math.floor(Math.random() * x);
}

function randFrom<T>(a: T[]) {
  return a[randInt(a.length)];
}
