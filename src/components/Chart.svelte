<script lang="ts">
  import { onMount } from 'svelte';
  import type DataSet from '../data/DataSet';
  import { DEFAULT_VIEWPORT } from '../data/DataSet';
  import EpiDate from '../data/EpiDate';
  import { Align, contains, isTouchEvent, NavMode, zeroPad } from './chartUtils';
  import type { IBox } from './chartUtils';
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  // import { writable } from 'svelte/store';

  export let style: string | undefined = undefined;
  export let className: string | undefined = undefined;

  let canvas: HTMLCanvasElement | null = null;

  export let navMode: NavMode;

  export let initialViewport: [number, number, number, number] | null = DEFAULT_VIEWPORT;

  let navBox: IBox | null = null;
  let xMin = DEFAULT_VIEWPORT[0];
  let xMax = DEFAULT_VIEWPORT[2];
  let yMin = DEFAULT_VIEWPORT[1];
  let yMax = DEFAULT_VIEWPORT[3];

  const animation = tweened(
    {
      xMin,
      xMax,
      yMin,
      yMax,
    },
    {
      duration: 750,
      easing: cubicInOut,
    },
  );

  function updateAnimation(current: { xMin: number; yMin: number; xMax: number; yMax: number }) {
    if (current.xMin !== xMin) {
      xMin = current.xMin;
    }
    if (current.xMax !== xMax) {
      xMax = current.xMax;
    }
    if (current.yMin !== yMin) {
      yMin = current.yMin;
    }
    if (current.yMax !== yMax) {
      yMax = current.yMax;
    }
  }

  $: {
    updateAnimation($animation);
  }

  $: {
    if (initialViewport) {
      setViewport(initialViewport[0], initialViewport[1], initialViewport[2], initialViewport[3]);
    }
  }

  let width = 100;
  let height = 100;
  const buttons: { box: IBox; handler: () => void }[] = [];

  /**
   * not tracked
   */
  const mouse = {
    pressed: false,
    dragging: false,
    hovering: false,
    down: null as null | { x: number; y: number },
    oriNavMode: null as NavMode | null,
  };
  let mousePosition = null as null | { x: number; y: number };

  export let showPoints = false;
  export let interpolate = false;
  export let highlightedDate: EpiDate | null = null;
  export let datasets: DataSet[] = [];

  function date2x(date: number): number {
    return ((date - xMin) / (xMax - xMin)) * width;
  }
  function x2date(x: number): number {
    return xMin + (x / width) * (xMax - xMin);
  }
  function value2y(value: number): number {
    return (1 - (value - yMin) / (yMax - yMin)) * height;
  }
  function y2value(y: number): number {
    return yMin - (y / height - 1) * (yMax - yMin);
  }

  export function getCanvas() {
    return canvas;
  }
  export function getViewport() {
    return [xMin, yMin, xMax, yMax];
  }

  $: ctx = canvas ? canvas.getContext('2d') : null;

  function computeMousePosition(e: MouseEvent | TouchEvent) {
    const { pageX, pageY } = isTouchEvent(e) ? e.changedTouches[0] : e;
    if (!canvas) {
      return { x: pageX, y: pageY };
    }
    const bb = canvas.parentElement!.getBoundingClientRect();
    return {
      x: pageX - bb.left,
      y: pageY - bb.top,
    };
  }

  function mouseDown(e: MouseEvent | TouchEvent) {
    const m = computeMousePosition(e);
    mouse.pressed = true;
    mouse.dragging = false;
    mouse.hovering = false;
    mousePosition = m;
    mouse.down = m;
    if (e.shiftKey || e.ctrlKey) {
      mouse.oriNavMode = navMode;
      if (e.shiftKey) {
        setNavMode(NavMode.crop);
      } else if (e.ctrlKey) {
        setNavMode(NavMode.zoom);
      }
    }
    if (navMode == NavMode.crop) {
      navBox = { x: m.x, y: m.y, w: 0, h: 0 };
    }
  }

  function mouseMove(e: MouseEvent | TouchEvent) {
    const m = computeMousePosition(e);
    mouse.dragging = mouse.pressed;
    mouse.hovering = !mouse.pressed;

    if (mouse.dragging) {
      const deltaX = -m.x + mousePosition!.x;
      const deltaY = +m.y - mousePosition!.y;
      if (navMode == NavMode.pan) {
        const dx = deltaX;
        const dy = deltaY;
        const x = (dx / width) * (xMax - xMin);
        const y = (dy / height) * (yMax - yMin);
        setViewport(xMin + x, yMin + y, xMax + x, yMax + y);
      } else if (navMode == NavMode.zoom) {
        const scale = 4 / ((width + height) / 2);
        const dx = deltaX * scale;
        const dy = deltaY * scale;
        const zx = dx >= 0 ? 1 / (1 + dx) : 1 + Math.abs(dx);
        const zy = dy >= 0 ? 1 / (1 + dy) : 1 + Math.abs(dy);
        zoom(zx, zy);
      } else if (navMode == NavMode.crop) {
        navBox!.w += -deltaX;
        navBox!.h += +deltaY;
      }
    }
    if (mouse.hovering) {
      highlight(EpiDate.fromIndex(Math.floor(x2date(m.x) + 0.5)));
    }
    mousePosition = m;
  }

  function mouseUp(e: MouseEvent | TouchEvent) {
    const m = computeMousePosition(e);
    const m1 = mouse.down;
    const m2 = m;
    mouse.pressed = false;
    mouse.dragging = false;
    mouse.hovering = true;
    mousePosition = m;
    mouse.down = null;
    if (m1 !== null) {
      mouseClick(m1, m2);
    }
    if (navBox !== null) {
      const box = navBox;
      navBox = null;
      if (navMode == NavMode.crop) {
        const x = Math.min(box.x, box.x + box.w);
        const y = Math.max(box.y, box.y + box.h);
        const w = +Math.abs(box.w);
        const h = -Math.abs(box.h);
        if (Math.abs(w) * Math.abs(h) >= 50) {
          setViewport(x2date(x), y2value(y), x2date(x + w), y2value(y + h));
        } else {
          console.log(
            'Crop box was very small, this was probably unintended. If you really want to apply the crop, use the following command:',
          );
          console.log(`  chart.setViewport(${x2date(x)},${y2value(y)},${x2date(x + 2)},${y2value(y + 2)});`);
        }
      }
    }
    if (mouse.oriNavMode != null) {
      setNavMode(mouse.oriNavMode);
      mouse.oriNavMode = null;
    }
  }
  function mouseOver(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    if (canvas) {
      canvas.focus();
    }
  }
  function mouseOut(e: TouchEvent | MouseEvent) {
    e.preventDefault();
    navBox = null;
    mouseUp(e);
    mouse.hovering = false;
    highlight(null);
    if (canvas) {
      canvas.blur();
    }
  }

  function mouseClick(m1: { x: number; y: number }, m2: { x: number; y: number }) {
    for (const button of buttons) {
      if (contains(button.box, m1) && contains(button.box, m2)) {
        button.handler();
      }
    }
  }
  function mouseWheel(e: WheelEvent) {
    e.preventDefault();
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
    const m = computeMousePosition(e);
    let dx, dy;
    const fx = +(m.x - width / 2) / (width / 2);
    const fy = -(m.y - height / 2) / (height / 2);
    dx = ((xMax - xMin) / 2) * fx;
    dy = ((yMax - yMin) / 2) * fy;
    setViewport(xMin + dx, yMin + dy, xMax + dx, yMax + dy);
    // zoom
    zoom(amount, amount);
    // pan back to the original location
    dx = ((xMax - xMin) / 2) * fx;
    dy = ((yMax - yMin) / 2) * fy;
    setViewport(xMin - dx, yMin - dy, xMax - dx, yMax - dy);
  }

  function zoom(x: number, y: number): void {
    // x-axis
    const xMid = (xMin + xMax) / 2;
    let xRange = (xMax - xMin) / x;
    xRange = Math.max(1, xRange);
    xRange = Math.min(365.25 * 100, xRange);
    // y-axis
    const yMid = (yMin + yMax) / 2;
    const yRange = (yMax - yMin) / y;
    setViewport(xMid - xRange / 2, yMid - yRange / 2, xMid + xRange / 2, yMid + yRange / 2);
  }

  function setViewport(x1: number, y1: number, x2: number, y2: number, animated = false): void {
    if (animated) {
      // update to current value
      animation.set(
        {
          xMin,
          yMin,
          xMax,
          yMax,
        },
        {
          duration: 0,
        },
      );
      animation.set(
        {
          xMin: x1,
          yMin: y1,
          xMax: x2,
          yMax: y2,
        },
        {
          duration: 750,
        },
      );
    } else {
      xMin = x1;
      xMax = x2;
      yMin = y1;
      yMax = y2;
    }
  }

  function highlight(date: EpiDate | null): void {
    let update = false;
    if (highlightedDate == null) {
      if (date != null) {
        update = true;
      }
    } else {
      if (date === null || highlightedDate.getIndex() != date.getIndex()) {
        update = true;
      }
    }
    if (update) {
      highlightedDate = date;
    }
  }
  function setNavMode(mode: NavMode): void {
    if (mode !== navMode) {
      navMode = mode;
      if (navMode !== NavMode.crop) {
        navBox = null;
      }
    }
  }

  function drawText(
    ctx: CanvasRenderingContext2D,
    str: string,
    x: number,
    y: number,
    angle: number,
    alignX: Align,
    alignY: Align,
    scale = 1,
    font = 'Calibri',
  ): IBox {
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

  export function fitData(shouldAnimate = false, extras: DataSet[] = []): void {
    if (datasets.length === 0) {
      return;
    }
    const temp = datasets[0].data;
    let _xMin = temp[0].getDate().getIndex() - 0.5;
    let _xMax = temp[temp.length - 1].getDate().getIndex() + 0.5;
    let _yMin = datasets[0].getPointValue(0);
    let _yMax = _yMin;
    let dss = [...datasets, ...extras];
    for (const ds of dss) {
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

    // patch for straight lines
    if (_xMin === _xMax) {
      if (_xMin !== 0) {
        _xMin *= 0.95;
        _xMax *= 1.05;
      } else {
        _xMin = -0.5;
        _xMax = 0.5;
      }
    }

    if (_yMin === _yMax) {
      if (_yMin !== 0) {
        _yMin *= 0.95;
        _yMax *= 1.05;
      } else {
        _yMin = -0.5;
        _yMax = 0.5;
      }
    }

    setViewport(_xMin, _yMin, _xMax, _yMax, shouldAnimate);
  }

  function drawLabel(
    ctx: CanvasRenderingContext2D,
    label: string,
    x1: number,
    x2: number,
    y: number,
    highlight: boolean,
  ): IBox {
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
    const textWidth = drawText(ctx, label, 0, -100, 0, Align.center, Align.top).w + 10;
    let left = x1;
    let right = x2;
    if (left < 0) {
      left = Math.min(0, x2 - textWidth);
    }
    if (right >= width) {
      right = Math.max(width - 1, x1 + textWidth);
    }
    drawText(ctx, label, (left + right) / 2, y, 0, Align.center, Align.top);
    return box;
  }

  function addButton(box: IBox, handler: () => void) {
    buttons.push({ box, handler });
  }

  function renderValueAxis(ctx: CanvasRenderingContext2D) {
    const interval = Math.pow(2, Math.floor(Math.log((yMax - yMin) / 4) / Math.log(2)));
    ctx.fillStyle = '#888';
    ctx.strokeStyle = '#f0f0f0';
    ctx.beginPath();
    for (let i = Math.ceil(yMin / interval); i <= Math.floor(yMax / interval); i++) {
      const y = value2y(i * interval);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      drawText(ctx, (i * interval).toLocaleString(), 0, y - 2, 0, Align.left, Align.bottom);
    }
    ctx.stroke();
    ctx.beginPath();
    if (mousePosition !== null) {
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#eee';
      const y = mousePosition.y;
      const value = y2value(y);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      drawText(ctx, value.toLocaleString(), width - 2, y - 2, 0, Align.right, Align.bottom);
    }
    ctx.stroke();
  }

  function renderDateAxis(ctx: CanvasRenderingContext2D) {
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
      const x1 = date2x(idx - 0.5);
      const x2 = date2x(idx + 0.5);
      ctx.fillStyle = '#eee';
      ctx.strokeStyle = '#888';
      ctx.fillRect(x1, 0, Math.max(1, x2 - x1), height);
    }
    // value at cursor
    if (mousePosition !== null) {
      ctx.fillStyle = '#eee';
      ctx.strokeStyle = '#888';
      ctx.fillRect(0, mousePosition.y - 0.5, width, 1);
    }

    if (labels.day_long || labels.day_short || labels.day_num || labels.day_blank) {
      renderDayLabels(ctx, firstDay, lastDay, labels);
    }
    if (labels.epiweek_long || labels.epiweek_short || labels.epiweek_blank) {
      renderWeekLabels(ctx, firstDay, lastDay, labels);
    }
    if (labels.month_long || labels.month_short || labels.month_blank) {
      renderMonthLabels(ctx, firstDay, lastDay, labels);
    }
    if (labels.year_long || labels.year_short || labels.year_blank) {
      renderYearLabels(ctx, firstDay, lastDay, labels);
    }
  }

  function renderDayLabels(
    ctx: CanvasRenderingContext2D,
    firstDay: EpiDate,
    lastDay: EpiDate,
    labels: { day_long: boolean; day_num: boolean; day_short: boolean },
  ) {
    let day = firstDay;
    while (day.getIndex() <= lastDay.getIndex()) {
      const idx = day.getIndex();
      const x1 = date2x(idx - 0.5);
      const x2 = date2x(idx + 0.5);
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
      const box = drawLabel(ctx, label, x1, x2, 45, highlight);
      addButton(box, animateDateRange(x1, x2));
      day = day.addDays(1);
    }
  }

  function renderWeekLabels(
    ctx: CanvasRenderingContext2D,
    firstDay: EpiDate,
    lastDay: EpiDate,
    labels: { epiweek_long: boolean; epiweek_short: boolean },
  ) {
    let day = EpiDate.fromIndex(firstDay.getIndex() - firstDay.getDayOfWeek());
    while (day.getIndex() <= lastDay.getIndex()) {
      const idx = day.getIndex();
      const dow = day.getDayOfWeek();
      const x1 = date2x(idx - dow - 0.5);
      const x2 = date2x(idx + (6 - dow) + 0.5);
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
      const box = drawLabel(ctx, label, x1, x2, 30, highlight);
      addButton(box, animateDateRange(x1, x2));
      day = day.addWeeks(1);
    }
  }

  function renderMonthLabels(
    ctx: CanvasRenderingContext2D,
    firstDay: EpiDate,
    lastDay: EpiDate,
    labels: { month_long: boolean; month_short: boolean },
  ) {
    // month labels
    let day = firstDay;
    while (day.getIndex() <= lastDay.getIndex()) {
      const thisMonth = new EpiDate(day.getYear(), day.getMonth(), 1);
      const nextMonth = thisMonth.addMonths(1);
      const x1 = date2x(thisMonth.getIndex() - 0.5);
      const x2 = date2x(nextMonth.getIndex() - 0.5);
      let label = "'";
      if (labels.month_long || labels.month_short) {
        label = EpiDate.getMonthName(day.getMonth(), labels.month_long);
      }
      const highlight =
        highlightedDate !== null &&
        highlightedDate.getYear() == day.getYear() &&
        highlightedDate.getMonth() == day.getMonth();
      const box = drawLabel(ctx, label, x1, x2, 15, highlight);
      addButton(box, animateDateRange(x1, x2));
      day = nextMonth;
    }
  }

  function renderYearLabels(
    ctx: CanvasRenderingContext2D,
    firstDay: EpiDate,
    lastDay: EpiDate,
    labels: { year_long: boolean; year_short: boolean },
  ) {
    let day = firstDay;
    while (day.getIndex() <= lastDay.getIndex()) {
      const thisYear = new EpiDate(day.getYear(), 1, 1);
      const nextYear = thisYear.addYears(1);
      const x1 = date2x(thisYear.getIndex() - 0.5);
      const x2 = date2x(nextYear.getIndex() - 0.5);
      let label: string;
      if (labels.year_long) {
        label = thisYear.getYear().toString();
      } else if (labels.year_short) {
        label = "'" + zeroPad(thisYear.getYear() % 100);
      } else {
        label = "'";
      }
      const highlight = highlightedDate !== null && highlightedDate.getYear() == day.getYear();
      const box = drawLabel(ctx, label, x1, x2, 0, highlight);
      addButton(box, animateDateRange(x1, x2));
      day = nextYear;
    }
  }

  function animateDateRange(x1: number, x2: number) {
    const d1 = x2date(x1);
    const d2 = x2date(x2);
    const cx = (d1 + d2) / 2;
    const dx = (d2 - d1) * 1.25;
    return () => setViewport(cx - dx / 2, yMin, cx + dx / 2, yMax, true);
  }

  function renderDateHighlight(ctx: CanvasRenderingContext2D) {
    if (highlightedDate == null) {
      return;
    }
    const dayName = EpiDate.getDayName(highlightedDate.getDayOfWeek(), false);
    const monthName = EpiDate.getMonthName(highlightedDate.getMonth(), false);
    const epiweek = zeroPad(highlightedDate.getEpiWeek());
    const label = `${dayName}, ${monthName} ${highlightedDate.getDay()}, ${highlightedDate.getYear()} [${highlightedDate.getEpiYear()}w${epiweek}]`;
    ctx.fillStyle = '#000';
    const x = Math.max(width * 0.1, Math.min(width * 0.9, date2x(highlightedDate.getIndex())));
    drawText(ctx, label, x, height - 10, 0, Align.center, Align.center);
  }

  function renderData(ctx: CanvasRenderingContext2D) {
    for (const ds of datasets) {
      renderDataSet(ctx, ds);
    }
    ctx.lineWidth = 1;
  }

  function renderDataSet(ctx: CanvasRenderingContext2D, dataset: DataSet) {
    const { data, color, gap, lineWidth } = dataset;
    let first = true;
    let date1 = 0;
    let date2 = 0;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const y = value2y(dataset.getPointValue(i));
      if (isNaN(y)) {
        continue;
      }
      date1 = date2;
      date2 = data[i].getDate().getIndex();
      if (date2 - date1 !== gap) {
        first = !interpolate;
      }
      const x = date2x(date2);

      if (first) {
        first = false;
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      if (showPoints) {
        const w = lineWidth * 2;
        ctx.fillRect(x - w, y - w, 2 * w, 2 * w);
      }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function renderLegend(ctx: CanvasRenderingContext2D) {
    let labelOffset = 0;
    for (const ds of datasets) {
      ctx.fillStyle = ds.color;
      const label = `— ${ds.title}`;
      drawText(ctx, label, width - 10, height - 10 - labelOffset, 0, Align.right, Align.bottom);
      labelOffset += 12;
    }
  }
  function renderNavBox(ctx: CanvasRenderingContext2D) {
    if (navMode == NavMode.crop && navBox !== null) {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(navBox.x, navBox.y, navBox.w, navBox.h);
    }
  }

  // eslint-disable-next-line no-unused-vars
  function render(_deps: Record<string, unknown>) {
    if (!ctx || !canvas) {
      return;
    }

    // reset buttons
    buttons.splice(0, buttons.length);

    // clear the chart
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.fillStyle = '#fff';

    if (datasets.length === 0) {
      // no data
      return;
    }
    ctx.save();
    renderValueAxis(ctx);
    renderDateAxis(ctx);
    renderData(ctx);
    renderDateHighlight(ctx);
    renderLegend(ctx);
    renderNavBox(ctx);
    ctx.restore();
  }

  $: {
    render({
      ctx,
      showPoints,
      interpolate,
      highlightedDate,
      navMode,
      xMin,
      xMax,
      yMin,
      yMax,
      navBox,
      width,
      height,
      mousePosition,
      datasets,
    });
  }

  onMount(() => {
    if (canvas && window.self === window.top) {
      // only focus if this is the top-level window (e.g. not in an iframe)
      canvas.focus();
    }
    if (datasets.length > 0) {
      fitData(true);
    }
  });
</script>

<div {style} class="wrapper {className || ''}" bind:clientWidth={width} bind:clientHeight={height} data-tour="chart">
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <canvas
    bind:this={canvas}
    {style}
    class={className}
    on:mousedown={mouseDown}
    on:touchstart={mouseDown}
    on:mouseup={mouseUp}
    on:touchend={mouseUp}
    on:mousemove={mouseMove}
    on:touchmove={mouseMove}
    on:mouseover={mouseOver}
    on:mouseout={mouseOut}
    on:wheel={mouseWheel}
  />
</div>

<style>
  .wrapper {
    position: relative;
    overflow: hidden;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
