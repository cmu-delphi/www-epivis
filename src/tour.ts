import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export const tour = new Shepherd.Tour({
  defaultStepOptions: {
    classes: 'shepherd-epivis-tour',
    cancelIcon: {
      enabled: true,
    },
    arrow: false,
    scrollTo: true,
  },
  useModalOverlay: true,
});

const next = tour.next.bind(tour);
const cancel = tour.cancel.bind(tour);

// Dismiss tour on future runs once it is cancelled or completed.
function dismissTour() {
  if (!localStorage.getItem('shepherd-tour')) {
    localStorage.setItem('shepherd-tour', 'yes');
  }
}
tour.on('cancel', dismissTour);
tour.on('complete', dismissTour);

const nextCancel = [
  {
    text: 'Next',
    action: next,
  },
  {
    text: 'Cancel',
    action: cancel,
  },
];

tour.addStep({
  attachTo: {
    element: '[data-tour=datatour]',
    on: 'auto',
  },
  title: 'Welcome to EpiVis',
  text: `<p>EpiVis is an interactive tool for visualizing epidemiological time-series data. This tour will introduce its main features.</p>
  
  <p>To review this information later on, use the "?" button in the upper right corner of the interface, or the 'h' hotkey.</p>`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=chart]',
    on: 'top-start',
  },
  title: 'Main Chart',
  text: `<p>
    The main view shows a time-based chart of the selected datasets. This view is freely navigable using mouse or touch controls.
  </p><p>
    The axes on the left side and on the top show the currently selected date / value range.
  </p>`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=top]',
    on: 'auto',
  },
  title: 'Chart Menu',
  text: `The menu on top of the chart features several different options, such as changing colors or exporting the chart as an image.`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=navmode]',
    on: 'auto',
  },
  title: 'Toggle between Navigation Modes',
  text: `EpiVis supports four navigation modes. Autofit ensures that all enabled datasets are fully displayed on the chart; while Pan, Crop, and Zoom can be used to manipulate the view.`,
  buttons: nextCancel,
});
tour.addStep({
  attachTo: {
    element: '[data-tour=chart]',
    on: 'bottom-end',
  },
  title: 'Mouse Panning',
  text: `Pressing the mouse and dragging it will pan the view. Using the mouse wheel will zoom the view.`,
  buttons: nextCancel,
});
tour.addStep({
  attachTo: {
    element: '[data-tour=chart]',
    on: 'bottom-end',
  },
  title: 'Mouse Cropping',
  text: `Dragging the mouse while the <code>Shift</code> key is pressed will temporarily switch to the Crop navigation mode, which will span a rectangle of interest.`,
  buttons: nextCancel,
});
tour.addStep({
  attachTo: {
    element: '[data-tour=chart]',
    on: 'bottom-end',
  },
  title: 'Mouse Zooming',
  text: `Dragging the mouse while the <code>Ctrl/Control</code> key is pressed will temporarily switch to the zoom mode. Moving the mouse up will zoom in and down will zoom out in the value domain. Similarly, moving the mouse left or right will zoom in or out on the date domain.`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=random]',
    on: 'auto',
  },
  title: 'Randomize Colors',
  text: `This action will recolor all visible datasets. Keyboard Shortcut: r`,
  buttons: nextCancel,
});
tour.addStep({
  attachTo: {
    element: '[data-tour=fit]',
    on: 'auto',
  },
  title: 'Fit Data to Screen',
  text: `This action will changes the chart view such that all selected datasets are fully shown. Keyboard Shortcut: f`,
  buttons: nextCancel,
});
tour.addStep({
  attachTo: {
    element: '[data-tour=points]',
    on: 'auto',
  },
  title: 'Toggle Point Rendering',
  text: `This action will change whether points should be rendered representing individual data points of the time series. Keyboard Shortcut: s`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=screenshot]',
    on: 'auto',
  },
  title: 'Download Screenshot',
  text: `This action will download the current view in PNG format.`,
  buttons: nextCancel,
});
tour.addStep({
  attachTo: {
    element: '[data-tour=link]',
    on: 'auto',
  },
  title: 'Create Shareable Link',
  text: `This action will show a shareable link that can be used to reproduce the current view (if possible).`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=browser]',
    on: 'right',
  },
  title: 'Data Browser',
  text: `<p>
    The left panel shows the loaded datasets. It has several options to load new datasets, which are going to be explained as part of this tour.
  </p>
  <p>
    The datasets are organized in a hierarchial structure. Each dataset can be individually shown in the chart by clicking on it.
  </p>`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=csv]',
    on: 'auto',
  },
  title: 'Load CSV File',
  text: `EpiVis supports loading CSV files to explore custom datasets.`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=api]',
    on: 'auto',
  },
  title: 'Load Data from EpiData API',
  text: `A more common option is to load existing time series from numerous data sources provided by the EpiData API.`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=manually]',
    on: 'auto',
  },
  title: 'Draw a custom line (Advanced)',
  text: `Another more advanced option is to define a custom line that should be drawn in the chart.`,
  buttons: nextCancel,
});

tour.addStep({
  attachTo: {
    element: '[data-tour=kernel]',
    on: 'auto',
  },
  title: 'Derive via a kernel function (Advanced)',
  text: `And another option is to derive one dataset by applying a kernel function to combine other datasets. For example, create a new dataset representing the average of two other datasets.`,
  buttons: nextCancel,
});

tour.addStep({
  title: 'Finish',
  text: `This concludes this overview about EpiVis. Have fun exploring time-series data!`,
  buttons: [
    {
      text: 'Finish',
      action: next,
    },
  ],
});
