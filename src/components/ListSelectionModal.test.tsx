import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ListSelectionModal } from './ListSelectionModal';
import type { Watchlist } from '../types';

const mockWatchlists: Watchlist[] = [
    { id: '1', name: 'Favorites', movieIds: [1, 2], createdAt: Date.now() },
    { id: '2', name: 'Watch Later', movieIds: [], createdAt: Date.now() },
];

describe('ListSelectionModal Component', () => {
    it('should not render when isOpen is false', () => {
        render(
            <ListSelectionModal
                isOpen={false}
                onClose={() => { }}
                onSelect={() => { }}
                watchlists={mockWatchlists}
                movieTitle="Test Movie"
            />
        );
        expect(screen.queryByText('Add to List')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
        render(
            <ListSelectionModal
                isOpen={true}
                onClose={() => { }}
                onSelect={() => { }}
                watchlists={mockWatchlists}
                movieTitle="Test Movie"
            />
        );
        expect(screen.getByText('Add to List')).toBeInTheDocument();
    });

    it('should display movie title', () => {
        render(
            <ListSelectionModal
                isOpen={true}
                onClose={() => { }}
                onSelect={() => { }}
                watchlists={mockWatchlists}
                movieTitle="Inception"
            />
        );
        expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    it('should display all watchlists', () => {
        render(
            <ListSelectionModal
                isOpen={true}
                onClose={() => { }}
                onSelect={() => { }}
                watchlists={mockWatchlists}
                movieTitle="Test"
            />
        );
        expect(screen.getByText('Favorites')).toBeInTheDocument();
        expect(screen.getByText('Watch Later')).toBeInTheDocument();
    });

    it('should display movie count for each list', () => {
        render(
            <ListSelectionModal
                isOpen={true}
                onClose={() => { }}
                onSelect={() => { }}
                watchlists={mockWatchlists}
                movieTitle="Test"
            />
        );
        expect(screen.getByText('2 movies')).toBeInTheDocument();
        expect(screen.getByText('0 movies')).toBeInTheDocument();
    });

    it('should call onSelect when a list is clicked', async () => {
        const handleSelect = vi.fn();
        const user = userEvent.setup();

        render(
            <ListSelectionModal
                isOpen={true}
                onClose={() => { }}
                onSelect={handleSelect}
                watchlists={mockWatchlists}
                movieTitle="Test"
            />
        );

        await user.click(screen.getByText('Favorites'));
        expect(handleSelect).toHaveBeenCalledWith('1');
    });

    it('should call onClose when X button is clicked', async () => {
        const handleClose = vi.fn();
        const user = userEvent.setup();

        render(
            <ListSelectionModal
                isOpen={true}
                onClose={handleClose}
                onSelect={() => { }}
                watchlists={mockWatchlists}
                movieTitle="Test"
            />
        );

        // Find the close button (X icon)
        const closeButton = screen.getByRole('button', { name: '' });
        await user.click(closeButton);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should handle empty watchlists', () => {
        render(
            <ListSelectionModal
                isOpen={true}
                onClose={() => { }}
                onSelect={() => { }}
                watchlists={[]}
                movieTitle="Test"
            />
        );
        expect(screen.getByText('Add to List')).toBeInTheDocument();
        expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
    });
});
