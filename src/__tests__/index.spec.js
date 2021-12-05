const { open, close, firstCase } = require('../index');

beforeEach(async () => {
    await open();
});

afterAll(async () => {
    await close();
});

describe('interface tests', () => {
    describe('When search for "Science: Computers"', () => {
        it('should return "No questions found."', async () => {
            const result = await firstCase();
            expect(result).toEqual('No questions found.');
        });
    });
});