const NAME_PREFIX = 'z__cw_ext';
const FILE = `${NAME_PREFIX}_file`;
const OPACITY = `${NAME_PREFIX}_opacity`;
const PROPERTY = `${NAME_PREFIX}_property`;
const BACKGROUND = `${NAME_PREFIX}_background`;
const BACKGROUND_STYLE = `#_chatContent:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: var(--file);
  background-size: var(--property);
  background-repeat: no-repeat;
  opacity: var(--opacity);
  z-index: -1;
}`;

function formatRule(id, value) {
  if (id.endsWith('background')) return value;
  if (id.endsWith('file')) {
    value = `url("${value}")`;
  }
  if (id.endsWith('opacity')) {
    value = value / 100;
  }
  return `:root { --${id.split('_').pop()}: ${value}}`;
}

function updateStyle(id, value) {
  const style = document.createElement('style');
  style.innerHTML = formatRule(id, value);

  const parent = document.getElementById(id);
  if (!parent) {
    const div = document.createElement('div');
    div.setAttribute('id', id);
    div.appendChild(style);
    const el = document.createElement('template');
    el.insertAdjacentElement('beforeend', div);

    document.querySelector('body').appendChild(el.firstElementChild);
    return;
  }

  if (parent.hasChildNodes()) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  parent.appendChild(style);
}

function init() {
  chrome.storage.local.get(
    {
      [FILE]: '',
      [OPACITY]: '20',
      [PROPERTY]: 'auto'
    },
    function(result) {
      updateStyle(FILE, result[FILE]);
      updateStyle(OPACITY, result[OPACITY] / 100);
      updateStyle(PROPERTY, result[PROPERTY]);
    }
  );
  updateStyle(BACKGROUND, BACKGROUND_STYLE);

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.payload) {
      updateStyle(request.payload.name, request.payload.value);
    }
  });
}

function wait() {
  setTimeout(function() {
    if (document.getElementById('_chatText')) {
      init();
      return;
    }
    wait();
  }, 123);
}

wait();
