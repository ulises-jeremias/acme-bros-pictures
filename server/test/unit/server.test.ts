import app from '../../src/server';
import config from '../../src/config';
import delay from 'delay';

const mockListen = jest.fn();
app.listen = mockListen;

afterEach(() => {
    mockListen.mockReset();
});

it('Server works', async () => {
    require('../../src/index');
    await delay(500);
    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(config.server.port);
});