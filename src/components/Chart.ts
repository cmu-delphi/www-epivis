import { DataSet, EpiDate } from '../data/model';

export enum NavMode {
  pan = 0,
  crop = 1,
  zoom = 2,
}
enum Align {
  left = 0,
  right = 1,
  bottom = 2,
  top = 3,
  center = 4,
}

interface IBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

function isTouchEvent(e: MouseEvent | TouchEvent): e is TouchEvent {
  return e.type.toLowerCase().indexOf('touch') === 0;
}

function zeroPad(num: number): string {
  return num < 10 ? `0${num}` : num.toString();
}
function contains(box: IBox, point: { x: number; y: number }): boolean {
  return box.x <= point.x && point.x <= box.x + box.w && box.y < point.y && point.y < box.y + box.h;
}

export default class Chart {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly mouse = {
    forceCrop: false,
    forceZoom: false,
    pressed: false,
    dragging: false,
    hovering: false,
    position: null as null | { x: number; y: number },
    down: null as null | { x: number; y: number },
  };
  private navMode = NavMode.pan;
  private navBox: IBox | null = null;
  private xMin = new EpiDate(2014, 1, 1).getIndex();
  private xMax = new EpiDate(2016, 1, 1).getIndex();
  private yMin = -1;
  private yMax = 1;
  private _showPoints = false;
  private _interpolate = false;
  private highlightedDate: EpiDate | null = null;
  private readonly datasets: DataSet[] = [];

  private readonly buttons: { box: IBox; handler: () => void }[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly listener?: { onNavModeChanged(mode: NavMode): void },
  ) {
    this.ctx = canvas.getContext('2d')!;

    if (window.self === window.top) {
      // only focus if this is the top-level window (e.g. not in an iframe)
      canvas.focus();
    }
    canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    canvas.addEventListener('touchstart', this.mouseDown.bind(this));

    canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    canvas.addEventListener('touchend', this.mouseUp.bind(this));

    canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    canvas.addEventListener('touchmove', this.mouseMove.bind(this));

    canvas.addEventListener('mouseover', this.mouseOver.bind(this));
    // canvas.addEventListener('touchenter', this.mouseMove.bind(this));

    canvas.addEventListener('mouseout', this.mouseOut.bind(this));
    // canvas.addEventListener('touchleave', this.mouseOut.bind(this));

    canvas.addEventListener('wheel', this.mouseWheel.bind(this));
    canvas.addEventListener('keydown', this.keyDown.bind(this));
    canvas.addEventListener('keyup', this.keyUp.bind(this));
  }

  get width(): number {
    return this.canvas.clientWidth;
  }
  get height(): number {
    return this.canvas.clientHeight;
  }

  date2x(date: number): number {
    const { xMax, xMin, width } = this;
    return ((date - xMin) / (xMax - xMin)) * width;
  }
  x2date(x: number): number {
    const { xMax, xMin, width } = this;
    return xMin + (x / width) * (xMax - xMin);
  }
  value2y(value: number): number {
    const { yMax, yMin, height } = this;
    return (1 - (value - yMin) / (yMax - yMin)) * height;
  }
  y2value(y: number): number {
    const { yMax, yMin, height } = this;
    return yMin - (y / height - 1) * (yMax - yMin);
  }

  private mousePosition(e: MouseEvent | TouchEvent) {
    const { pageX, pageY } = isTouchEvent(e) ? e.changedTouches[0] : e;
    return {
      x: pageX - this.canvas.offsetLeft,
      y: pageY - this.canvas.offsetTop,
    };
  }

  private mouseDown(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const m = this.mousePosition(e);
    this.mouse.pressed = true;
    this.mouse.dragging = false;
    this.mouse.hovering = false;
    this.mouse.position = m;
    this.mouse.down = m;
    if (this.navMode == NavMode.crop) {
      this.navBox = { x: m.x, y: m.y, w: 0, h: 0 };
    }
  }

  private mouseMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const m = this.mousePosition(e);
    const { mouse, navMode, xMin, xMax, yMax, yMin, width, height } = this;
    mouse.dragging = mouse.pressed;
    mouse.hovering = !mouse.pressed;

    if (mouse.dragging) {
      const deltaX = -m.x + mouse.position!.x;
      const deltaY = +m.y - mouse.position!.y;
      if (navMode == NavMode.pan) {
        const dx = deltaX;
        const dy = deltaY;
        const x = (dx / width) * (xMax - xMin);
        const y = (dy / height) * (yMax - yMin);
        this.setViewport(xMin + x, yMin + y, xMax + x, yMax + y);
      } else if (navMode == NavMode.zoom) {
        const scale = 4 / ((width + height) / 2);
        const dx = deltaX * scale;
        const dy = deltaY * scale;
        const zx = dx >= 0 ? 1 / (1 + dx) : 1 + Math.abs(dx);
        const zy = dy >= 0 ? 1 / (1 + dy) : 1 + Math.abs(dy);
        this.zoom(zx, zy);
      } else if (navMode == NavMode.crop) {
        this.navBox!.w += -deltaX;
        this.navBox!.h += +deltaY;
      }
    }
    if (mouse.hovering) {
      this.highlight(EpiDate.fromIndex(Math.floor(this.x2date(m.x) + 0.5)));
    }
    mouse.position = m;
    this.render();
  }

  private mouseUp(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const { mouse, navMode } = this;
    const m = this.mousePosition(e);
    const m1 = mouse.down;
    const m2 = m;
    mouse.pressed = false;
    mouse.dragging = false;
    mouse.hovering = true;
    mouse.position = m;
    mouse.down = null;
    if (m1 !== null) {
      this.mouseClick(m1, m2);
    }
    if (this.navBox !== null) {
      const box = this.navBox;
      this.navBox = null;
      if (navMode == NavMode.crop) {
        const x = Math.min(box.x, box.x + box.w);
        const y = Math.max(box.y, box.y + box.h);
        const w = +Math.abs(box.w);
        const h = -Math.abs(box.h);
        if (Math.abs(w) * Math.abs(h) >= 50) {
          this.setViewport(this.x2date(x), this.y2value(y), this.x2date(x + w), this.y2value(y + h));
        } else {
          console.log(
            'Crop box was very small, this was probably unintended. If you really want to apply the crop, use the following command:',
          );
          console.log(
            `  chart.setViewport(${this.x2date(x)},${this.y2value(y)},${this.x2date(x + 2)},${this.y2value(y + 2)});`,
          );
        }
      }
    }
    this.setNavMode(NavMode.pan);
  }
  private mouseOver(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    this.canvas.focus();
  }
  private mouseOut(e: TouchEvent | MouseEvent) {
    e.preventDefault();
    this.navBox = null;
    this.mouseUp(e);
    this.mouse.hovering = false;
    this.highlight(null);
    this.canvas.blur();
  }
  private mouseClick(m1: { x: number; y: number }, m2: { x: number; y: number }) {
    let hit = false;
    for (const button of this.buttons) {
      if (contains(button.box, m1) && contains(button.box, m2)) {
        hit = true;
        button.handler();
      }
    }
    if (hit) {
      this.render();
    }
  }
  private keyDown(e: KeyboardEvent) {
    e.preventDefault();
    if (e.shiftKey) {
      this.mouse.forceCrop = true;
      this.setNavMode(NavMode.crop);
    } else if (e.ctrlKey) {
      this.mouse.forceZoom = true;
      this.setNavMode(NavMode.zoom);
    }
  }
  private keyUp(e: KeyboardEvent) {
    e.preventDefault();
    if (e.shiftKey) {
      this.mouse.forceCrop = false;
    } else if (e.ctrlKey) {
      this.mouse.forceZoom = false;
    }
    this.setNavMode(NavMode.pan);
  }
  private mouseWheel(e: WheelEvent) {
    e.preventDefault();
    const { xMin, xMax, yMax, yMin, width, height } = this;
    // scroll info
    const mode = e.deltaMode;
    const delta = e.deltaY;
    const ticks = Math.abs(delta);
    let amount = 0;
    // zoom calculation
    if (mode === 0) {
      // DOM_DELTA_PIXEL
      amount = 1 + ticks / 500;
    } else if (mode == 1) {
      // DOM_DELTA_LINE
      amount = 1 + ticks / 10;
    } else if (mode == 2) {
      // DOM_DELTA_PAGE
      amount = 1 + ticks / 2;
    } else {
      // unknown mode
      amount = 1.5;
    }
    if (delta > 0) {
      amount = 1 / amount;
    }
    // pan so that the zoom is centered under the mouse
    const m = this.mousePosition(e);
    let dx, dy;
    const fx = +(m.x - width / 2) / (width / 2);
    const fy = -(m.y - height / 2) / (height / 2);
    dx = ((xMax - xMin) / 2) * fx;
    dy = ((yMax - yMin) / 2) * fy;
    this.setViewport(xMin + dx, yMin + dy, xMax + dx, yMax + dy);
    // zoom
    this.zoom(amount, amount);
    // pan back to the original location
    dx = ((xMax - xMin) / 2) * fx;
    dy = ((yMax - yMin) / 2) * fy;
    this.setViewport(xMin - dx, yMin - dy, xMax - dx, yMax - dy);
    this.render();
  }
  randomizeColors(): void {
    for (const ds of this.datasets) {
      ds.randomize();
    }
    this.render();
  }
  showPoints(show = !this._showPoints): void {
    this._showPoints = show;
    this.render();
  }
  interpolate(interp = !this._interpolate): void {
    this._interpolate = interp;
    this.render();
  }
  isShowingPoints(): boolean {
    return this._showPoints;
  }
  zoom(x: number, y: number): void {
    // x-axis

    const { xMin, xMax, yMax, yMin } = this;
    const xMid = (xMin + xMax) / 2;
    let xRange = (xMax - xMin) / x;
    xRange = Math.max(1, xRange);
    xRange = Math.min(365.25 * 100, xRange);
    this.xMin = xMid - xRange / 2;
    this.xMax = xMid + xRange / 2;
    // y-axis
    const yMid = (yMin + yMax) / 2;
    const yRange = (yMax - yMin) / y;
    this.yMin = yMid - yRange / 2;
    this.yMax = yMid + yRange / 2;
    // render
    this.render();
  }

  setViewport(x1: number, y1: number, x2: number, y2: number): void {
    this.xMin = x1;
    this.xMax = x2;
    this.yMin = y1;
    this.yMax = y2;
    this.render();
  }

  getViewport(): [number, number, number, number] {
    return [this.xMin, this.yMin, this.xMax, this.yMax];
  }

  highlight(date: EpiDate | null): void {
    let update = false;
    if (this.highlightedDate == null) {
      if (date != null) {
        update = true;
      }
    } else {
      if (date === null || this.highlightedDate.getIndex() != date.getIndex()) {
        update = true;
      }
    }
    if (update) {
      this.highlightedDate = date;
      this.render();
    }
  }
  setNavMode(mode: NavMode): void {
    if (this.mouse.forceCrop) {
      mode = NavMode.crop;
    }
    if (this.mouse.forceZoom) {
      mode = NavMode.zoom;
    }
    if (mode !== this.navMode) {
      this.navMode = mode;
      switch (this.navMode) {
        case NavMode.pan:
          this.canvas.style.cursor = 'default';
          break;
        case NavMode.crop:
          this.canvas.style.cursor = 'crosshair';
          break;
        case NavMode.zoom:
          this.canvas.style.cursor = 'nesw-resize';
          break;
      }
      if (this.navMode !== NavMode.crop) {
        this.navBox = null;
      }
      if (this.listener) {
        this.listener.onNavModeChanged(this.navMode);
      }
    }
    this.render();
  }

  getNavMode(): NavMode {
    return this.navMode;
  }

  private drawText(
    str: string,
    x: number,
    y: number,
    angle: number,
    alignX: Align,
    alignY: Align,
    scale = 1,
    font = 'Calibri',
  ): IBox {
    const { ctx } = this;
    const size = Math.round(12 * scale);
    ctx.font = `${size}px ${font}`;
    const w = ctx.measureText(str).width;
    const h = size;
    let dx = 0;
    let dy = 0;
    if (alignX == Align.left) {
      dx = 0;
    } else if (alignX == Align.right) {
      dx = -w;
    } else if (alignX == Align.center) {
      dx = -w / 2;
    } else {
      ctx.fillStyle = '#f00';
    }
    if (alignY == Align.bottom) {
      dy = 0;
    } else if (alignY == Align.top) {
      dy = h;
    } else if (alignY == Align.center) {
      dy = h / 2;
    } else {
      ctx.fillStyle = '#f00';
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(str, dx, dy);
    ctx.restore();
    return { x: x + dx, y: y + dy - h, w: w, h: h };
  }

  addDataset(ds: DataSet): void {
    // if (demoAnimation !== null) {
    //   demoAnimation.finish();
    //   demoAnimation = null;
    //   datasets = [];
    // }

    const index = this.datasets.indexOf(ds);
    if (index < 0) {
      this.datasets.push(ds);
      this.render();
    }
  }
  removeDataset(ds: DataSet): void {
    const index = this.datasets.indexOf(ds);
    if (index >= 0) {
      this.datasets.splice(index, 1);
    }
    this.render();
  }

  autoScale(shouldAnimate = false): void {
    if (this.datasets.length === 0) {
      return;
    }
    const { datasets } = this;
    const temp = datasets[0].data;
    let _xMin = temp[0].getDate().getIndex() - 0.5;
    let _xMax = temp[temp.length - 1].getDate().getIndex() + 0.5;
    let _yMin = datasets[0].getPointValue(0);
    let _yMax = _yMin;
    for (const ds of datasets) {
      const data = ds.data;
      _xMin = Math.min(_xMin, data[0].getDate().getIndex() - 0.5);
      _xMax = Math.max(_xMax, data[data.length - 1].getDate().getIndex() + 0.5);
      for (let i = 0; i < data.length; i++) {
        const v = ds.getPointValue(i);
        if (isNaN(_yMin) || v < _yMin) {
          _yMin = v;
        }
        if (isNaN(_yMax) || v > _yMax) {
          _yMax = v;
        }
      }
    }
    const dy = (_yMax - _yMin) / 0.75;
    const cy = (_yMin + _yMax) / 2;
    _yMin = cy - dy / 2;
    _yMax = cy + dy / 2;

    if (shouldAnimate) {
      // const playAnimation = this.animatePan(_xMin, _yMin, _xMax, _yMax);
      // playAnimation();
    } else {
      this.setViewport(_xMin, _yMin, _xMax, _yMax);
    }
  }

  private drawLabel(label: string, x1: number, x2: number, y: number, highlight: boolean): IBox {
    const { ctx, width } = this;
    // box for mouse click
    const box: IBox = {
      x: x1,
      y: y,
      w: x2 - x1,
      h: 15,
    };
    // background
    if (highlight) {
      ctx.fillStyle = '#eee';
      ctx.fillRect(x1, y, x2 - x1, 15);
      // frame
      ctx.strokeStyle = '#888';
      ctx.beginPath();
      ctx.moveTo(x1, y + 15);
      ctx.lineTo(x1, y);
      ctx.moveTo(x2, y);
      ctx.lineTo(x2, y + 15);
      ctx.stroke();
      ctx.fillStyle = '#000';
    } else {
      ctx.fillStyle = '#888';
    }
    // label
    const textWidth = this.drawText(label, 0, -100, 0, Align.center, Align.top).w + 10;
    let left = x1;
    let right = x2;
    if (left < 0) {
      left = Math.min(0, x2 - textWidth);
    }
    if (right >= width) {
      right = Math.max(width - 1, x1 + textWidth);
    }
    this.drawText(label, (left + right) / 2, y, 0, Align.center, Align.top);
    return box;
  }

  private addButton(box: IBox, handler: () => void) {
    this.buttons.push({ box, handler });
  }

  private render(): void {
    const { ctx, datasets, width, height } = this;
    // reset buttons
    this.buttons.splice(0, this.buttons.length);

    // clear the chart
    ctx.lineWidth = 1;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    if (datasets.length === 0) {
      // no data
      return;
    }
    this.renderValueAxis();
    this.renderDateAxis();
    this.renderDateHighlight();
    this.renderData();
    this.renderLegend();
    this.renderNavBox();
  }

  private renderValueAxis() {
    const { ctx, yMax, yMin, width } = this;
    const interval = Math.pow(2, Math.floor(Math.log((yMax - yMin) / 4) / Math.log(2)));
    ctx.fillStyle = '#888';
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    for (let i = Math.ceil(yMin / interval); i <= Math.floor(yMax / interval); i++) {
      const y = this.value2y(i * interval);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      this.drawText(String(i * interval), 0, y - 2, 0, Align.left, Align.bottom);
    }
    if (this.mouse.position !== null) {
      const y = this.mouse.position.y;
      const value = this.y2value(y);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      this.drawText(String(value), width - 2, y - 2, 0, Align.right, Align.bottom);
    }
    ctx.stroke();
  }

  private renderDateAxis() {
    const { xMin, xMax, highlightedDate, ctx, width, height } = this;
    const daysPerPixel = (xMax - xMin) / width;
    //console.log(daysPerPixel);
    const labels = {
      day_long: daysPerPixel < 0.01,
      day_short: daysPerPixel < 0.02,
      day_num: daysPerPixel < 0.04,
      day_blank: daysPerPixel < 0.08,
      epiweek_long: daysPerPixel < 0.12,
      epiweek_short: daysPerPixel < 0.2,
      epiweek_blank: daysPerPixel < 0.5,
      month_long: daysPerPixel < 0.38,
      month_short: daysPerPixel < 1.2,
      month_blank: daysPerPixel < 3.0,
      year_long: daysPerPixel < 8.0,
      year_short: daysPerPixel < 15.0,
      year_blank: daysPerPixel < 25.0,
    };
    const firstDay = EpiDate.fromIndex(Math.floor(xMin));
    const lastDay = EpiDate.fromIndex(Math.ceil(xMax));

    // highlighted day
    if (highlightedDate !== null) {
      const idx = highlightedDate.getIndex();
      const x1 = this.date2x(idx - 0.5);
      const x2 = this.date2x(idx + 0.5);
      ctx.fillStyle = '#eee';
      ctx.strokeStyle = '#888';
      ctx.fillRect(x1, 0, Math.max(1, x2 - x1), height);
    }
    // value at cursor
    if (this.mouse.position !== null) {
      ctx.fillStyle = '#eee';
      ctx.strokeStyle = '#888';
      ctx.fillRect(0, this.mouse.position.y - 0.5, width, 1);
    }

    if (labels.day_long || labels.day_short || labels.day_num || labels.day_blank) {
      this.renderDayLabels(firstDay, lastDay, labels);
    }
    if (labels.epiweek_long || labels.epiweek_short || labels.epiweek_blank) {
      this.renderWeekLabels(firstDay, lastDay, labels);
    }
    if (labels.month_long || labels.month_short || labels.month_blank) {
      this.renderMonthLabels(firstDay, lastDay, labels);
    }
    if (labels.year_long || labels.year_short || labels.year_blank) {
      this.renderYearLabels(firstDay, lastDay, labels);
    }
  }

  private renderDayLabels(
    firstDay: EpiDate,
    lastDay: EpiDate,
    labels: { day_long: boolean; day_num: boolean; day_short: boolean },
  ) {
    const { highlightedDate } = this;
    let day = firstDay;
    while (day.getIndex() <= lastDay.getIndex()) {
      const idx = day.getIndex();
      const x1 = this.date2x(idx - 0.5);
      const x2 = this.date2x(idx + 0.5);
      const labelNum = zeroPad(day.getDay());
      let label: string;
      if (labels.day_long || labels.day_short) {
        const labelName = EpiDate.getDayName(day.getDayOfWeek(), labels.day_long);
        if (labels.day_long) {
          label = `${labelName}, ${labelNum}`;
        } else {
          label = `${labelName}-${labelNum}`;
        }
      } else if (labels.day_num) {
        label = labelNum;
      } else {
        label = "'";
      }
      const highlight = highlightedDate !== null && highlightedDate.getIndex() == day.getIndex();
      const box = this.drawLabel(label, x1, x2, 45, highlight);
      this.addButton(box, this.animateDateRange(x1, x2));
      day = day.addDays(1);
    }
  }

  private renderWeekLabels(
    firstDay: EpiDate,
    lastDay: EpiDate,
    labels: { epiweek_long: boolean; epiweek_short: boolean },
  ) {
    const { highlightedDate } = this;
    let day = EpiDate.fromIndex(firstDay.getIndex() - firstDay.getDayOfWeek());
    while (day.getIndex() <= lastDay.getIndex()) {
      const idx = day.getIndex();
      const dow = day.getDayOfWeek();
      const x1 = this.date2x(idx - dow - 0.5);
      const x2 = this.date2x(idx + (6 - dow) + 0.5);
      const labelWeek = zeroPad(day.getEpiWeek());
      let label: string;
      if (labels.epiweek_long) {
        const labelYear = day.getEpiYear().toString();
        label = labelYear + 'w' + labelWeek;
      } else if (labels.epiweek_short) {
        label = 'w' + labelWeek;
      } else {
        label = "'";
      }
      const highlight =
        highlightedDate !== null &&
        highlightedDate.getEpiYear() == day.getEpiYear() &&
        highlightedDate.getEpiWeek() == day.getEpiWeek();
      const box = this.drawLabel(label, x1, x2, 30, highlight);
      this.addButton(box, this.animateDateRange(x1, x2));
      day = day.addWeeks(1);
    }
  }

  private renderMonthLabels(
    firstDay: EpiDate,
    lastDay: EpiDate,
    labels: { month_long: boolean; month_short: boolean },
  ) {
    const { highlightedDate } = this;
    // month labels
    let day = firstDay;
    while (day.getIndex() <= lastDay.getIndex()) {
      const thisMonth = new EpiDate(day.getYear(), day.getMonth(), 1);
      const nextMonth = thisMonth.addMonths(1);
      const x1 = this.date2x(thisMonth.getIndex() - 0.5);
      const x2 = this.date2x(nextMonth.getIndex() - 0.5);
      let label = "'";
      if (labels.month_long || labels.month_short) {
        label = EpiDate.getMonthName(day.getMonth(), labels.month_long);
      }
      const highlight =
        highlightedDate !== null &&
        highlightedDate.getYear() == day.getYear() &&
        highlightedDate.getMonth() == day.getMonth();
      const box = this.drawLabel(label, x1, x2, 15, highlight);
      this.addButton(box, this.animateDateRange(x1, x2));
      day = nextMonth;
    }
  }

  private renderYearLabels(firstDay: EpiDate, lastDay: EpiDate, labels: { year_long: boolean; year_short: boolean }) {
    const { highlightedDate } = this;
    let day = firstDay;
    while (day.getIndex() <= lastDay.getIndex()) {
      const thisYear = new EpiDate(day.getYear(), 1, 1);
      const nextYear = thisYear.addYears(1);
      const x1 = this.date2x(thisYear.getIndex() - 0.5);
      const x2 = this.date2x(nextYear.getIndex() - 0.5);
      let label: string;
      if (labels.year_long) {
        label = thisYear.getYear().toString();
      } else if (labels.year_short) {
        label = "'" + zeroPad(thisYear.getYear() % 100);
      } else {
        label = "'";
      }
      const highlight = highlightedDate !== null && highlightedDate.getYear() == day.getYear();
      const box = this.drawLabel(label, x1, x2, 0, highlight);
      this.addButton(box, this.animateDateRange(x1, x2));
      day = nextYear;
    }
  }

  private animateDateRange(x1: number, x2: number) {
    return () => {
      console.log(x1, x2);
      // TODO;
    };
  }

  private renderDateHighlight() {
    const { highlightedDate, ctx, width, height } = this;
    if (highlightedDate == null) {
      return;
    }
    const dayName = EpiDate.getDayName(highlightedDate.getDayOfWeek(), false);
    const monthName = EpiDate.getMonthName(highlightedDate.getMonth(), false);
    const epiweek = zeroPad(highlightedDate.getEpiWeek());
    const label = `${dayName}, ${monthName} ${highlightedDate.getDay()}, ${highlightedDate.getYear()} [${highlightedDate.getEpiYear()}w${epiweek}]`;
    ctx.fillStyle = '#000';
    const x = Math.max(width * 0.1, Math.min(width * 0.9, this.date2x(highlightedDate.getIndex())));
    this.drawText(label, x, height - 10, 0, Align.center, Align.center);
  }

  private renderData() {
    for (const ds of this.datasets) {
      this.renderDataSet(ds);
    }
    this.ctx.lineWidth = 1;
  }

  private renderDataSet(dataset: DataSet) {
    const { ctx } = this;
    const { data, color, gap, lineWidth } = dataset;
    let first = true;
    let date1 = 0;
    let date2 = 0;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const y = this.value2y(dataset.getPointValue(i));
      if (isNaN(y)) {
        continue;
      }
      date1 = date2;
      date2 = data[i].getDate().getIndex();
      if (date2 - date1 !== gap) {
        first = !this._interpolate;
      }
      const x = this.date2x(date2);

      if (first) {
        first = false;
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      if (this._showPoints) {
        const w = lineWidth * 2;
        ctx.fillRect(x - w, y - w, 2 * w, 2 * w);
      }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  private renderLegend() {
    const { ctx, width, height } = this;
    let labelOffset = 0;
    for (const ds of this.datasets) {
      ctx.fillStyle = ds.color;
      const label = `-${ds.title}`;
      this.drawText(label, width - 10, height - 10 - labelOffset, 0, Align.right, Align.bottom);
      labelOffset += 12;
    }
  }
  private renderNavBox() {
    const { navBox, navMode } = this;
    if (navMode == NavMode.crop && navBox !== null) {
      this.ctx.strokeStyle = '#000';
      this.ctx.strokeRect(navBox.x, navBox.y, navBox.w, navBox.h);
    }
  }
}

// var Chart = function (canvasID, listener) {
//   function prepareAnimation() {
//     if (animation !== null && animation.isRunning()) {
//       animation.finish(false);
//     }
//   }
//   function animateDateRange(x1, x2) {
//     const d1 = x2date(x1);
//     const d2 = x2date(x2);
//     const cx = (d1 + d2) / 2;
//     const dx = (d2 - d1) * 1.25;
//     return self.animatePan(cx - dx / 2, yMin, cx + dx / 2, yMax);
//   }
//   this.animatePan = function (x1, y1, x2, y2) {
//     const before = {
//       x1: xMin,
//       y1: yMin,
//       x2: xMax,
//       y2: yMax,
//     };
//     const after = {
//       x1: x1,
//       y1: y1,
//       x2: x2,
//       y2: y2,
//     };
//     return function () {
//       function update(dt, a) {
//         const b = 1 - a;
//         self.setViewport(
//           b * before.x1 + a * after.x1,
//           b * before.y1 + a * after.y1,
//           b * before.x2 + a * after.x2,
//           b * before.y2 + a * after.y2,
//         );
//       }
//       prepareAnimation();
//       animation = new Animate.Task(update, 60, 0.75, Animate.Ease.double_sine);
//       animation.start();
//     };
//   };

//   datasets.push(sampleDataset);
//   this.autoScale();
//   // animate it for even more fun
//   demoAnimation = new Animate.Task(
//     function (dx, x) {
//       const two_pi = Math.PI * 2;
//       function sin(a, b) {
//         return (Math.sin(x * a * two_pi + b) + 1) / 2;
//       }
//       function hex(a) {
//         a = Math.floor(a * 255);
//         return a < 16 ? '0' + a.toString(16) : a.toString(16);
//       }
//       const r = 0.5 * sin(0.05, (1 / 3) * two_pi);
//       const g = 0.5 * sin(0.05, (2 / 3) * two_pi);
//       const b = 0.5 * sin(0.05, (0 / 3) * two_pi);
//       sampleDataset.color = '#' + hex(r) + hex(g) + hex(b);
//       self.render();
//     },
//     1,
//     0,
//     Animate.Ease.sine,
//   );
//   demoAnimation.start();
//   // user interaction
// };
