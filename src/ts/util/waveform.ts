/*This is a modified version of https://github.com/samcrosoft/waveformjs, the original one is written in coffee script, and I rewrite it into typescript*/

import { EventEmitter } from "./event-emitter";

interface WaveformOptions {
  container?: HTMLElement
  canvas?: HTMLCanvasElement
  trackLength?: number
  data?: number[]
  outerColor?: string
  reflection?: number
  interpolate?: boolean
  bindResize?: boolean
  fadeOpacity?: number
  width?: number
  height?: number
  gutterWidth?: number
  waveWidth?: number
}

export const DEFAULT_MAX_OPACITY = 1
export const DEFAULT_MIN_OPACITY = 0.2
export const WAVE_FOCUS = 'waveFocus'
export const WAVE = 'wave'
export const WAVE_ACTIVE = 'waveActive'
export const WAVE_SELECTED = 'waveSelected'
export const GUTTER = 'gutter'
export const GUTTER_ACTIVE = 'gutterActive'
export const GUTTER_SELECTED = 'gutterSelected'
export const REFLECTION = 'reflection'
export const REFLECTION_ACTIVE = 'reflectionActive'
export const EVENT_READY = "ready"
export const EVENT_CLICK = "click"
export const EVENT_HOVER = "hover"
export const EVENT_RESIZED = "hover"

export class Waveform extends EventEmitter {
  readonly DEFAULT_MAX_OPACITY = DEFAULT_MAX_OPACITY
  readonly DEFAULT_MIN_OPACITY = DEFAULT_MIN_OPACITY
  readonly WAVE_FOCUS = WAVE_FOCUS
  readonly WAVE = WAVE
  readonly WAVE_ACTIVE = WAVE_ACTIVE
  readonly WAVE_SELECTED = WAVE_SELECTED
  readonly GUTTER = GUTTER
  readonly GUTTER_ACTIVE = GUTTER_ACTIVE
  readonly GUTTER_SELECTED = GUTTER_SELECTED
  readonly REFLECTION = REFLECTION
  readonly REFLECTION_ACTIVE = REFLECTION_ACTIVE
  readonly EVENT_READY = EVENT_READY
  readonly EVENT_CLICK = EVENT_CLICK
  readonly EVENT_HOVER = EVENT_HOVER
  readonly EVENT_RESIZED = EVENT_RESIZED
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private data: number[] = []
  private outerColor = 'transparent'
  private reflection = 0
  private interpolate = true
  private bindResize = false
  private fadeOpacity = 0.5
  private wavesCollection: number[] = []
  private context: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private waveWidth = 2;
  private gutterWidth = 1;
  private waveOffset = 0;
  private reflectionHeight = 0;
  private waveHeight = 0;
  private colors: { [key: string]: (string | CanvasGradient) } = {};
  private active = -1;
  private clickPercent = 0;
  private selected = -1;
  private isPlaying = false;
  private hasStartedPlaying = false;
  private trackLength = 0;
  constructor(options: WaveformOptions) {
    super()
    Object.assign(this, options);
    if (!this.canvas) {
      if (this.container) {
        this.spawnCanvas(options.width || this.container.clientWidth, options.height || this.container.clientHeight);
        this.width = parseInt(this.context.canvas.width.toString(), 10);
        this.height = parseInt(this.context.canvas.height.toString(), 10);
      } else {
        throw 'Either canvas or container option must be passed';
      }
    }

    this.fadeOpacity = this.fadeOpacity || this.DEFAULT_MAX_OPACITY;
    if (isNaN(this.fadeOpacity)) {
      throw new Error('Fade Opacity Can Only Be A Number');
    } else if (this.fadeOpacity < this.DEFAULT_MIN_OPACITY || this.fadeOpacity > this.DEFAULT_MAX_OPACITY) {
      throw new Error("Fade Opacity Can Only Be A Number Between " + this.DEFAULT_MIN_OPACITY + " and " + this.DEFAULT_MAX_OPACITY);
    }

    this.initialize();
  }

  private spawnCanvas(width: number, height: number) {
    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
  };

  private initialize() {
    this.updateHeight();
    this.setColors();
    this.bindEventHandlers();
    this.cache();
    this.redraw();
    if (this.bindResize === true) {
      this.bindContainerResize();
    }
    this.fireEvent(this.EVENT_READY);
  };

  private updateHeight() {
    this.waveOffset = Math.round(this.height - (this.height * this.reflection));
    this.reflectionHeight = Math.round(this.height - this.waveOffset);
    this.waveHeight = this.height - this.reflectionHeight;
  };

  private setColors() {
    this.setColor(this.WAVE_FOCUS, '#333333');
    this.setGradient(this.WAVE, [{ color: '#666666', offset: 0 }, { color: '#868686', offset: 1 }]);
    this.setGradient(this.WAVE_ACTIVE, [{ color: '#FF3300', offset: 0 }, { color: '#FF5100', offset: 1 }]);
    this.setGradient(this.WAVE_SELECTED, [{ color: '#993016', offset: 0 }, { color: '#973C15', offset: 1 }]);
    this.setGradient(this.GUTTER, [{ color: '#6B6B6B', offset: 0 }, { color: '#c9c9c9', offset: 1 }]);
    this.setGradient(this.GUTTER_ACTIVE, [{ color: '#FF3704', offset: 0 }, { color: '#FF8F63', offset: 1 }]);
    this.setGradient(this.GUTTER_SELECTED, [{ color: '#9A371E', offset: 0 }, { color: '#CE9E8A', offset: 1 }]);
    this.setColor(this.REFLECTION, '#999999');
    this.setColor(this.REFLECTION_ACTIVE, '#FFC0A0');
  }

  private setColor(name: string, color: string) {
    this.colors[name] = color;
  }

  private setGradient(name: string, colorObjs: { color: string, offset: number }[]) {
    let gradient: CanvasGradient, i: number;
    gradient = this.context.createLinearGradient(0, this.waveOffset, 0, 0);
    i = 0;
    while (i < colorObjs.length) {
      gradient.addColorStop(colorObjs[i].offset, colorObjs[i].color);
      i += 1;
    }
    this.colors[name] = gradient;
  };

  private getMouseClickPosition(evt: MouseEvent) {
    let canvas: HTMLCanvasElement, rect: DOMRect, x: number, y: number;
    canvas = this.canvas;
    rect = canvas.getBoundingClientRect();
    x = Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    y = Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
    return [x, y];
  };

  private fireEvent(name: string, ...data: any[]) {
    this.trigger(name, data);
  };

  private bindEventHandlers() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseOver.bind(this));
    this.canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
  };

  private onMouseOut(e: MouseEvent) {
    this.selected = -1;
    this.redraw();
  };

  private onMouseOver(e: MouseEvent) {
    let
      aPos: number[],//coordinate in [x,y] format
      mousePosTrackTime: number,
      waveClicked: number,
      x: number;
    if (this.hasStartedPlaying === true && this.isPaused() === true) {
      return true;
    }
    aPos = this.getMouseClickPosition(e);
    x = aPos[0];
    waveClicked = this.getWaveClicked(x);
    mousePosTrackTime = this.getMousePosTrackTime(x);
    this.fireEvent(this.EVENT_HOVER, mousePosTrackTime, waveClicked);
    this.selected = waveClicked;
    this.redraw();
  };

  private onMouseDown(e: MouseEvent) {
    let aPos: number[],//coordinate in [x,y] format
      x: number;
    aPos = this.getMouseClickPosition(e);
    x = aPos[0];
    this.clickPercent = x / this.width;
    this.fireEvent(this.EVENT_CLICK, this.clickPercent * 100);
    this.active = this.calcPercent();
    this.redraw();
  };

  private bindContainerResize() {
    window.addEventListener("resize", () => {
      return () => {
        let iContWidth: number;
        iContWidth = this.container.clientWidth;
        this.update({
          width: iContWidth
        });
        this.redraw();
        return this.trigger(this.EVENT_RESIZED, [iContWidth]);
      };
    });
  };


  private setPlaying(val = true) {
    this.isPlaying = val;
  };

  private setPaused() {
    this.setPlaying(false);
  };

  isPaused() {
    return this.active > 0 && this.isPlaying === false;
  };

  play(perct: number) {
    this.playProgress(perct);
  };

  pause() {
    this.setPaused();
    console.log("is paused is ", this.isPaused());
  };

  playProgress(perct: number) {
    let iActive: number;
    if (this.hasStartedPlaying === null) {
      this.hasStartedPlaying = true;
    }
    if (this.isPlaying === false) {
      this.setPlaying(true);
    }
    iActive = Math.round((perct / 100) * this.wavesCollection.length);
    this.active = iActive;
    this.redraw();
  };

  private calcPercent() {
    return Math.round(this.clickPercent * this.width / (this.waveWidth + this.gutterWidth));
  };

  private getWaveClicked(x: number) {
    let fReturn: number, waveClicked: number;
    waveClicked = Math.round(x / (this.waveWidth + this.gutterWidth));
    fReturn = 0;
    if (waveClicked > this.wavesCollection.length) {
      fReturn = this.wavesCollection.length;
    } else if (waveClicked < 0) {
      fReturn = 0;
    } else {
      fReturn = waveClicked;
    }
    return fReturn;
  };

  private getMousePosTrackTime(x: number) {
    let fReturn: number, mousePosTrackTime: number;
    mousePosTrackTime = this.trackLength / this.wavesCollection.length * this.getWaveClicked(x);
    fReturn = 0;
    if (mousePosTrackTime > this.trackLength) {
      fReturn = this.trackLength;
    } else if (mousePosTrackTime < 0) {
      fReturn = 0;
    } else {
      fReturn = mousePosTrackTime;
    }
    return fReturn;
  };

  private redraw() {
    requestAnimationFrame(this.render.bind(this));
  };

  private render() {
    let d: number, dNext: number, gutterX: number, i: number, j: number, len: number, ref: number[], reflectionHeight: number, results: number[], t: number, xPos: number, yPos: number;
    i = 0;
    ref = this.wavesCollection;
    t = this.width / this.data.length;
    xPos = 0;
    yPos = this.waveOffset;
    this.clear();
    j = 0;
    len = ref.length;
    results = [];
    while (j < len) {
      d = ref[j];
      dNext = ref[j + 1];

      /*
      Draw the wave here
       */
      if (this.selected > 0 && (this.selected <= j && j < this.active) || (this.selected > j && j >= this.active)) {
        this.context.fillStyle = this.colors[this.WAVE_SELECTED];
      } else if (this.active > j) {
        this.context.fillStyle = this.colors[this.WAVE_ACTIVE];
      } else {
        this.context.fillStyle = this.colors[this.WAVE_FOCUS];
      }

      this.context.fillRect(xPos, yPos, this.waveWidth, d);

      /*
      draw the gutter
       */
      if (this.selected > 0 && (this.selected <= j && j < this.active) || (this.selected > j && j >= this.active)) {
        this.context.fillStyle = this.colors[this.GUTTER_SELECTED];
      } else if (this.active > j) {
        this.context.fillStyle = this.colors[this.GUTTER_ACTIVE];
      } else {
        this.context.fillStyle = this.colors[this.GUTTER];
      }
      gutterX = Math.max(d, dNext);
      this.context.fillRect(xPos + this.waveWidth, yPos, this.gutterWidth, gutterX);

      /*
       draw the reflection
       */
      if (this.reflection > 0) {
        reflectionHeight = Math.abs(d) / (1 - this.reflection) * this.reflection;
        if (this.active > i) {
          this.context.fillStyle = this.colors[this.REFLECTION_ACTIVE];
        } else {
          this.context.fillStyle = this.colors[this.REFLECTION];
        }
        this.context.fillRect(xPos, yPos, this.waveWidth, reflectionHeight);
      }
      xPos += this.waveWidth + this.gutterWidth;
      results.push(j++);
    }
    return results;
  };

  private clear() {
    this.context.fillStyle = this.outerColor;
    this.context.clearRect(0, 0, this.width, this.height);
    return this.context.fillRect(0, 0, this.width, this.height);
  };


  /*
   Data related codes
   */

  private setData(data: number[]) {
    return this.data = data;
  };

  private getData() {
    return this.data;
  };

  private setDataInterpolated(data: number[]) {
    return this.setData(this.interpolateArray(data, this.width));
  };

  private setDataCropped(data: number[]) {
    return this.setData(this.expandArray(data, this.width));
  };

  private linearInterpolate(before: number, after: number, atPoint: number) {
    return before + (after - before) * atPoint;
  };

  private expandArray(data: number[], limit: number, defaultValue = 0) {
    let i: number, j: number, newData: number[] = [], ref: number;
    if (defaultValue === null) {
      defaultValue = 0;
    }
    if (data.length > limit) {
      newData = data.slice(data.length - limit, data.length);
    } else {
      i = j = 0;
      ref = limit - 1;
      while ((0 <= ref ? j <= ref : j >= ref)) {
        newData[i] = data[i] || defaultValue;
        i = (0 <= ref ? ++j : --j);
      }
    }
    return newData;
  };

  private interpolateArray(data: number[], fitCount: number) {
    let after: number, atPoint: number, before: number, i: number, newData: number[] = [], springFactor: number, tmp: number;
    springFactor = (data.length - 1) / (fitCount - 1);
    newData[0] = data[0];
    i = 1;
    while (i < fitCount - 1) {
      tmp = i * springFactor;
      before = Math.floor(tmp);
      after = Math.ceil(tmp);
      atPoint = tmp - before;
      newData[i] = this.linearInterpolate(data[before], data[after], atPoint);
      i++;
    }
    newData[fitCount - 1] = data[data.length - 1];
    return newData;
  };

  private putDataIntoWaveBlock() {
    let data: number[], fAbsValue: number, fAverage: number, fWavePoint: number, i: number, iWaveBlock: number, iWaveCount: number, j: number, key: number, newDataBlocks: number[], sum: number;
    iWaveBlock = this.waveWidth + this.gutterWidth;
    data = this.getData();
    newDataBlocks = [];
    iWaveCount = Math.ceil(data.length / iWaveBlock);
    i = 0;
    while (i < iWaveCount) {
      sum = 0;
      j = 0;
      while (j < iWaveBlock) {
        key = (i * iWaveBlock) + j;
        sum += data[key];
        j++;
      }
      fAverage = sum / iWaveBlock;
      fAbsValue = fAverage * this.waveHeight;
      fWavePoint = Math.floor(-Math.abs(fAbsValue));
      newDataBlocks.push(fWavePoint);
      i++;
    }
    return newDataBlocks;
  };

  private cache() {
    if (this.interpolate === false) {
      this.setDataCropped(this.data);
    } else {
      this.setDataInterpolated(this.data);
    }
    this.wavesCollection = this.putDataIntoWaveBlock();
  };


  /*
    Data update details here
   */

  private update(options: WaveformOptions) {
    if (options) {
      if (options.gutterWidth) {
        this.gutterWidth = options.gutterWidth;
      }
      if (options.waveWidth) {
        this.waveWidth = options.waveWidth;
      }
      if (options.width) {
        this.width = options.width;
        this.canvas.width = this.width;
      }
      if (options.height) {
        this.height = options.height;
        this.canvas.height = this.height;
      }
      if (options.reflection === 0 || options.reflection) {
        this.reflection = options.reflection;
      }
      if (options.interpolate) {
        this.interpolate = options.interpolate;
      }

      /*
        Re-calculate the wave block formations once one of the following is altered
       */
      if (options.gutterWidth || options.waveWidth || options.width || options.height || options.reflection || options.interpolate || options.reflection === 0) {
        this.cache();
      }
      if (options.height || options.reflection || options.reflection === 0) {
        this.updateHeight();
      }
    }
    this.redraw();
  };


}
