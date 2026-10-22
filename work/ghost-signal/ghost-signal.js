/** GHOST SIGNAL: an original, deterministic three-stage browser narrative. */
export const STAGES = [
  {
    label: '01 / ENTRY POINT',
    title: 'Find a way into the noise.',
    story: 'The packet is waiting on a shuttered public terminal. Three carriers still answer. Choose the first hop before the terminal is reclaimed by the city’s automated sweep.',
    choices: [
      { name: 'Slip through the sideband', node: 'SIDEBAND', description: 'Hide inside the static of an abandoned radio channel. Quiet, but the recording loses detail.', exposure: -8, integrity: -12, log: 'Sideband carrier acquired. The voice is quieter. So is your footprint.' },
      { name: 'Ride the express carrier', node: 'EXPRESS', description: 'Use a maintained service line. The file travels cleanly, but the network notices your handshake.', exposure: 18, integrity: 6, log: 'Express carrier acquired. A watchdog records the handshake.' },
      { name: 'Recover the archive cache', node: 'ARCHIVE', description: 'Rebuild missing data from a forgotten backup. It takes a visible query to find it.', exposure: 10, integrity: 18, log: 'Archive cache recovered. Missing voices return to the recording.' }
    ]
  },
  {
    label: '02 / THE RELAY',
    title: 'A checkpoint lights up ahead.',
    story: 'The network has begun checking every relay. The receiver is still there, a small pulse in the dark. Decide what you are willing to lose to keep moving.',
    choices: [
      { name: 'Drop into the blind spot', node: 'BLIND SPOT', description: 'Strip the packet down and pass between routine scans. Some of the recording cannot follow.', exposure: -12, integrity: -10, log: 'Blind spot crossed. Less evidence behind you; less of the recording ahead.' },
      { name: 'Use the mirror relay', node: 'MIRROR', description: 'Reconstruct the damaged signal across a working relay. The repair leaves another trace.', exposure: 10, integrity: 8, log: 'Mirror relay synchronized. A checksum restores damaged audio.' },
      { name: 'Force a priority override', node: 'OVERRIDE', description: 'Push straight through the checkpoint. The packet stays stable; the watchdogs get a clear look.', exposure: 32, integrity: 4, log: 'Priority override accepted. Watchdogs mark the route for inspection.' }
    ]
  },
  {
    label: '03 / FINAL DELIVERY',
    title: 'One last hop. Make it count.',
    story: 'The Lantern Collective opens its receiver. You can send one narrow stream, split the packet across two paths, or let the whole city hear it. The final route decides what survives.',
    choices: [
      { name: 'Send a private whisper', node: 'WHISPER', description: 'Compress the recording into a discreet direct link. A smaller signal is harder to follow.', exposure: -10, integrity: -12, log: 'Whisper sent. The receiver listens behind a closed channel.' },
      { name: 'Split the signal', node: 'TWIN ROUTE', description: 'Send redundant pieces down two different paths. Better recovery, with two trails to find.', exposure: 12, integrity: 5, log: 'Twin routes dispatched. The receiver begins joining the pieces.' },
      { name: 'Open the broadcast', node: 'BROADCAST', description: 'Use the public carrier’s error correction. The recording comes through clearly—and loudly.', exposure: 28, integrity: 10, log: 'Public broadcast opened. The voice reaches beyond your intended receiver.' }
    ]
  }
];

export const ENDINGS = {
  traced: { label: 'ENDING 04 / A VISIBLE TRACE', title: 'The city heard you.', story: 'The recording reaches the carrier, but so do the watchdogs. They map your route before the Collective can secure the delivery. For a moment, a voice fills the public channel. Then the receiver goes silent.', note: 'A strong signal can still leave too much evidence. Your exposure reached the tracing threshold of 65%.' },
  complete: { label: 'ENDING 01 / FULL RECOVERY', title: 'Every voice survives.', story: 'The receiver blinks once, then settles. The whole recording is there: names, laughter, the room tone of a place the city says never existed. The Collective makes its first copy. Someone will remember.', note: 'You kept exposure below 65% and preserved at least 85% integrity. The complete archive arrived safely.' },
  fragment: { label: 'ENDING 03 / PARTIAL MEMORY', title: 'One voice gets through.', story: 'Most of the recording is static. Then a name breaks through, clear enough to write down. The Collective saves what remains. You protected the route, but there are gaps no repair can fill.', note: 'The route stayed below the tracing threshold, but integrity fell below 58%. Only a fragment could be recovered.' },
  quiet: { label: 'ENDING 02 / QUIET DELIVERY', title: 'A memory stays alive.', story: 'The receiver answers with two soft pulses. Some words are missing, some voices are faint, but the story is still there. The Collective starts transcribing. For tonight, the city has failed to erase everything.', note: 'Exposure stayed below 65%. The recording arrived with enough integrity to be useful, though some details were lost.' }
};

const clamp = value => Math.max(0, Math.min(100, value));

export function createState() {
  return { started: false, stage: 0, exposure: 12, integrity: 72, history: [] };
}

export function getEnding(state) {
  if (state.exposure >= 65) return 'traced';
  if (state.integrity >= 85) return 'complete';
  if (state.integrity < 58) return 'fragment';
  return 'quiet';
}

export function chooseRoute(state, choiceIndex) {
  if (!state.started || state.stage >= STAGES.length || !Number.isInteger(choiceIndex) || !STAGES[state.stage].choices[choiceIndex]) return state;
  const choice = STAGES[state.stage].choices[choiceIndex];
  return {
    ...state,
    stage: state.stage + 1,
    exposure: clamp(state.exposure + choice.exposure),
    integrity: clamp(state.integrity + choice.integrity),
    history: [...state.history, { stage: state.stage, index: choiceIndex, ...choice }]
  };
}

function initialize() {
  const element = id => document.getElementById(id);
  const content = element('decision-content');
  if (!content) return;
  const briefMarkup = content.innerHTML;
  let state = createState();
  const signed = value => `${value > 0 ? '+' : '−'}${Math.abs(value)}`;

  function announce(message) {
    element('run-status').textContent = message;
  }

  function updateNetwork() {
    element('exposure-value').innerHTML = `${state.exposure}<span>%</span>`;
    element('integrity-value').innerHTML = `${state.integrity}<span>%</span>`;
    element('exposure-meter').value = state.exposure;
    element('exposure-meter').textContent = `${state.exposure}%`;
    element('integrity-meter').value = state.integrity;
    element('integrity-meter').textContent = `${state.integrity}%`;
    element('network-state').textContent = !state.started ? 'STANDBY' : state.stage < 3 ? `HOP ${state.stage + 1} / 3` : 'RUN COMPLETE';
    element('route-summary').textContent = state.history.length ? state.history.map(choice => choice.node).join(' → ') : state.started ? 'Connection established. Choose your entry point.' : 'Your route will appear here.';

    document.querySelectorAll('[data-node]').forEach(node => {
      const [stage, index] = node.dataset.node.split('-').map(Number);
      const selected = state.history.some(choice => choice.stage === stage && choice.index === index);
      node.classList.toggle('selected', selected);
      node.classList.toggle('unselected', stage < state.stage && !selected);
      node.classList.toggle('available', state.started && stage === state.stage);
    });

    const edges = new Set();
    state.history.forEach((choice, index) => {
      const previous = state.history[index - 1];
      edges.add(index === 0 ? `start-0-${choice.index}` : `${previous.stage}-${previous.index}-${choice.stage}-${choice.index}`);
    });
    if (state.stage === 3) edges.add(`2-${state.history[2].index}-end`);
    document.querySelectorAll('[data-edge]').forEach(edge => edge.classList.toggle('selected', edges.has(edge.dataset.edge)));
    document.querySelector('.map-destination').classList.toggle('complete', state.stage === 3);

    const logs = state.started ? ['Connection established. The Collective is listening.', ...state.history.map(choice => choice.log)] : ['Receiver standing by. Waiting for your connection.'];
    element('event-log').replaceChildren(...logs.map((message, index) => {
      const item = document.createElement('li');
      const number = document.createElement('span');
      number.className = 'log-index';
      number.textContent = String(index).padStart(2, '0');
      const text = document.createElement('p');
      text.textContent = message;
      item.append(number, text);
      return item;
    }));
    element('log-count').textContent = `${String(state.started ? logs.length : 0).padStart(2, '0')} EVENTS`;
    element('reset-run').hidden = !state.started;
  }

  function renderStage() {
    const stage = STAGES[state.stage];
    element('stage-label').textContent = stage.label;
    content.innerHTML = `
      <div class="stage-progress" aria-label="Decision ${state.stage + 1} of 3">${STAGES.map((_, index) => `<span class="${index < state.stage ? 'done' : index === state.stage ? 'active' : ''}"></span>`).join('')}</div>
      <h3 class="decision-title" id="current-stage-title" tabindex="-1">${stage.title}</h3>
      <p class="decision-story">${stage.story}</p>
      <div class="choice-list" aria-labelledby="current-stage-title">${stage.choices.map((choice, index) => `
        <button type="button" class="route-choice" data-choice="${index}">
          <span class="choice-key" aria-hidden="true">0${index + 1}</span>
          <span><span class="choice-name">${choice.name}<span aria-hidden="true">↗</span></span>
          <span class="choice-description">${choice.description}</span>
          <span class="choice-effects"><span class="effect-exposure">EXPOSURE ${signed(choice.exposure)}%</span><span class="effect-integrity">INTEGRITY ${signed(choice.integrity)}%</span></span></span>
        </button>`).join('')}</div>
      <p class="choice-note">Choose one route to continue. Changes are percentage points; values stay between 0 and 100.</p>`;
    element('current-stage-title').focus({ preventScroll: false });
  }

  function renderEnding() {
    const endingKey = getEnding(state);
    const ending = ENDINGS[endingKey];
    element('stage-label').textContent = 'TRANSMISSION COMPLETE / DEBRIEF';
    content.innerHTML = `
      <p class="outcome-kicker">${ending.label}</p>
      <h3 class="outcome-title" id="outcome-title" data-ending="${endingKey}" tabindex="-1">${ending.title}</h3>
      <p class="decision-story">${ending.story}</p>
      <div class="outcome-stats"><div><span>FINAL EXPOSURE</span><strong>${state.exposure}%</strong></div><div><span>FINAL INTEGRITY</span><strong>${state.integrity}%</strong></div></div>
      <p class="outcome-note">${ending.note}</p>
      <button class="primary-button" type="button" data-replay>TRY ANOTHER ROUTE <span aria-hidden="true">↺</span></button>
      <p class="brief-note">Three choices. Different consequences. Every run starts fresh.</p>`;
    element('outcome-title').focus({ preventScroll: false });
  }

  function startRun() {
    state = { ...createState(), started: true };
    updateNetwork();
    renderStage();
    announce('Connection established. Decision 1 of 3. Exposure 12 percent. Integrity 72 percent.');
  }

  function resetRun() {
    state = createState();
    element('stage-label').textContent = 'MISSION BRIEF / READ IN';
    content.innerHTML = briefMarkup;
    updateNetwork();
    element('start-run').focus({ preventScroll: true });
    announce('Run reset. Ready to establish a new connection.');
  }

  content.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    // A double-click must not make the next decision under the same pointer.
    if (event.detail > 1) return;
    if (button.id === 'start-run' || button.hasAttribute('data-replay')) {
      startRun();
      return;
    }
    if (!button.hasAttribute('data-choice')) return;
    state = chooseRoute(state, Number(button.dataset.choice));
    updateNetwork();
    if (state.stage === 3) {
      renderEnding();
      announce(`${ENDINGS[getEnding(state)].title} Final exposure ${state.exposure} percent. Final integrity ${state.integrity} percent.`);
    } else {
      renderStage();
      announce(`Decision ${state.stage + 1} of 3. Exposure ${state.exposure} percent. Integrity ${state.integrity} percent.`);
    }
  });

  element('reset-run').addEventListener('click', resetRun);
  document.querySelector('[data-replay-link]').addEventListener('click', startRun);
  updateNetwork();
}

if (typeof document !== 'undefined') initialize();
