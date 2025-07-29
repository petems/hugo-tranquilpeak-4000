// Mock jQuery and DOM
const mockJQuery = jest.fn();
mockJQuery.fn = {
  find: jest.fn(),
  click: jest.fn(),
  parent: jest.fn(),
  siblings: jest.fn(),
  addClass: jest.fn(),
  removeClass: jest.fn(),
  hide: jest.fn(),
  show: jest.fn(),
  eq: jest.fn(),
  index: jest.fn(),
  children: jest.fn(),
  ready: jest.fn(),
};

global.$ = global.jQuery = mockJQuery;

// Mock document ready
global.jQuery.ready = jest.fn();
global.jQuery.fn.ready = jest.fn();

// Mock document
global.document = {
  readyState: 'complete',
};

describe('TabbedCodeBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize TabbedCodeBlock constructor', () => {
    // Load the module
    require('../assets/js/tabbed-codeblocks.js');

    // Check if TabbedCodeBlock is defined
    expect(typeof TabbedCodeBlock).toBe('function');
  });

  test('should call document ready when module loads', () => {
    require('../assets/js/tabbed-codeblocks.js');

    expect(mockJQuery.fn.ready).toHaveBeenCalledWith(expect.any(Function));
  });

  test('should create TabbedCodeBlock instance with correct selector', () => {
    const mockElement = { find: jest.fn() };
    mockJQuery.mockReturnValue(mockElement);

    require('../assets/js/tabbed-codeblocks.js');

    // Get the ready callback
    const readyCallback = mockJQuery.fn.ready.mock.calls[0][0];
    readyCallback();

    expect(mockJQuery).toHaveBeenCalledWith('.codeblock--tabbed');
  });

  test('should set up click handlers for tabs', () => {
    const mockTab = { click: jest.fn() };
    const mockTabs = { find: jest.fn().mockReturnValue(mockTab) };
    mockJQuery.mockReturnValue(mockTabs);

    require('../assets/js/tabbed-codeblocks.js');

    // Get the ready callback
    const readyCallback = mockJQuery.fn.ready.mock.calls[0][0];
    readyCallback();

    expect(mockTabs.find).toHaveBeenCalledWith('.tab');
    expect(mockTab.click).toHaveBeenCalledWith(expect.any(Function));
  });
}); 