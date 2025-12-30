import { renderHook, act as rtlAct } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
    const originalLocalStorage = window.localStorage;
    let mockStorage: Record<string, string>;

    beforeEach(() => {
        mockStorage = {};
        const mockLocalStorage = {
            getItem: vi.fn((key: string) => mockStorage[key] || null),
            setItem: vi.fn((key: string, value: string) => { mockStorage[key] = value; }),
            removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
            clear: vi.fn(() => { mockStorage = {}; }),
            length: 0,
            key: vi.fn(),
        };
        Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
    });

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, writable: true });
    });

    it('should return initial value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
        expect(result.current[0]).toBe('initialValue');
    });

    it('should return stored value from localStorage', () => {
        mockStorage['testKey'] = JSON.stringify('storedValue');

        const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
        expect(result.current[0]).toBe('storedValue');
    });

    it('should update value and persist to localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

        rtlAct(() => {
            result.current[1]('newValue');
        });

        expect(result.current[0]).toBe('newValue');
        expect(mockStorage['testKey']).toBe(JSON.stringify('newValue'));
    });

    it('should handle objects', () => {
        const { result } = renderHook(() => useLocalStorage('testKey', { count: 0 }));

        rtlAct(() => {
            result.current[1]({ count: 5 });
        });

        expect(result.current[0]).toEqual({ count: 5 });
        expect(mockStorage['testKey']).toBe(JSON.stringify({ count: 5 }));
    });

    it('should handle arrays', () => {
        const { result } = renderHook(() => useLocalStorage<string[]>('testKey', []));

        rtlAct(() => {
            result.current[1](['item1', 'item2']);
        });

        expect(result.current[0]).toEqual(['item1', 'item2']);
    });

    it('should support functional updates', () => {
        const { result } = renderHook(() => useLocalStorage('counter', 0));

        rtlAct(() => {
            result.current[1]((prev: number) => prev + 1);
        });

        expect(result.current[0]).toBe(1);
    });
});
