// Mock jQuery and DOM
const mockJQuery = jest.fn();
mockJQuery.fn = {
  height: jest.fn(),
  addClass: jest.fn(),
  removeClass: jest.fn(),
  scrollTop: jest.fn(),
  ready: jest.fn(),
};

global.$ = global.jQuery = mockJQuery;

// Mock document ready
global.jQuery.ready = jest.fn();
global.jQuery.fn.ready = jest.fn();

// Mock window and document
global.window = {
  scrollTop: 0,
  height: 800,
  scroll: jest.fn(),
};

global.document = {
  height: 2000,
  readyState: 'complete',
};

// Mock setInterval
global.setInterval = jest.fn();

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should initialize Header constructor', () => {
    // Mock header element
    const mockHeader = { height: jest.fn().mockReturnValue(60) };
    mockJQuery.mockImplementation((selector) => {
      if (selector === '#header') return mockHeader;
      if (selector === 'window') return { scroll: jest.fn() };
      return { scrollTop: jest.fn().mockReturnValue(0), height: jest.fn().mockReturnValue(800) };
    });

    require('../assets/js/header.js');

    // Check if Header is defined
    expect(typeof Header).toBe('function');
  });

  test('should call document ready when module loads', () => {
    const mockHeader = { height: jest.fn().mockReturnValue(60) };
    mockJQuery.mockImplementation((selector) => {
      if (selector === '#header') return mockHeader;
      if (selector === 'window') return { scroll: jest.fn() };
      return { scrollTop: jest.fn().mockReturnValue(0), height: jest.fn().mockReturnValue(800) };
    });

    require('../assets/js/header.js');

    expect(mockJQuery.fn.ready).toHaveBeenCalledWith(expect.any(Function));
  });

  test('should set up scroll interval', () => {
    const mockHeader = { height: jest.fn().mockReturnValue(60) };
    mockJQuery.mockImplementation((selector) => {
      if (selector === '#header') return mockHeader;
      if (selector === 'window') return { scroll: jest.fn() };
      return { scrollTop: jest.fn().mockReturnValue(0), height: jest.fn().mockReturnValue(800) };
    });

    require('../assets/js/header.js');

    // Get the ready callback
    const readyCallback = mockJQuery.fn.ready.mock.calls[0][0];
    readyCallback();

    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 250);
  });

  test('should add header-up class when scrolling down', () => {
    const mockHeader = { 
      height: jest.fn().mockReturnValue(60),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    };
    
    mockJQuery.mockImplementation((selector) => {
      if (selector === '#header') return mockHeader;
      if (selector === 'window') return { scroll: jest.fn() };
      return { 
        scrollTop: jest.fn().mockReturnValue(100), 
        height: jest.fn().mockReturnValue(800) 
      };
    });

    require('../assets/js/header.js');

    // Get the ready callback and create header instance
    const readyCallback = mockJQuery.fn.ready.mock.calls[0][0];
    readyCallback();

    // Get the setInterval callback
    const intervalCallback = setInterval.mock.calls[0][0];
    
    // Simulate scroll
    intervalCallback();

    expect(mockHeader.addClass).toHaveBeenCalledWith('header-up');
  });
}); 