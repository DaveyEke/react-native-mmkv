import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  render,
  waitFor,
} from 'react-native-harness';
import {
  type MMKV,
  createMMKV,
  useMMKVBuffer,
  useMMKVString,
} from 'react-native-mmkv';

let renderCount = 0;

function StringProbe({ storage }: { storage: MMKV }): null {
  useMMKVString('key', storage);
  renderCount++;
  return null;
}

function BufferProbe({ storage }: { storage: MMKV }): null {
  useMMKVBuffer('key', storage);
  renderCount++;
  return null;
}

describe('MMKV Hooks', () => {
  let storage: MMKV;

  beforeEach(() => {
    storage = createMMKV({ id: 'hooks-test' });
    storage.clearAll();
    renderCount = 0;
  });

  afterEach(() => {
    storage.clearAll();
  });

  it('useMMKVString renders a bounded number of times for a stored value', async () => {
    storage.set('key', 'value');

    await render(<StringProbe storage={storage} />);

    await waitFor(() => expect(renderCount).toBeGreaterThan(0));
    expect(renderCount).toBeLessThan(5);
  });

  it('useMMKVBuffer renders a bounded number of times for a stored value', async () => {
    const buffer = new ArrayBuffer(3);
    new Uint8Array(buffer).set([1, 100, 255]);
    storage.set('key', buffer);

    await render(<BufferProbe storage={storage} />);

    await waitFor(() => expect(renderCount).toBeGreaterThan(0));
    expect(renderCount).toBeLessThan(5);
  });
});
