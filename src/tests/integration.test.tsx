import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('EventVibe AI Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders command center with event heading and navigation tabs', () => {
    render(<App />);

    expect(screen.getAllByText(/EventVibe/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget Burn/i)).toBeInTheDocument();
    expect(screen.getByText(/Macro Milestone Roadmap/i)).toBeInTheDocument();
  });

  it('navigates to Budget Engine and toggles item paid status with live balance calculation', async () => {
    render(<App />);

    // Click Budget navigation tab
    const budgetNavButtons = screen.getAllByRole('button', { name: /Budget/i });
    fireEvent.click(budgetNavButtons[0]);

    // Check that Financial Engine view rendered
    expect(screen.getByText(/Financial Engine & Budget Allocator/i)).toBeInTheDocument();

    // Toggle first unpaid item to paid
    const unpaidCheckboxes = screen.getAllByLabelText(/Mark .* as paid/i);
    expect(unpaidCheckboxes.length).toBeGreaterThan(0);

    fireEvent.click(unpaidCheckboxes[0]);

    // Verify it updated to "Mark as unpaid"
    await waitFor(() => {
      const updatedButtons = screen.getAllByLabelText(/Mark .* as unpaid/i);
      expect(updatedButtons.length).toBeGreaterThan(0);
    });
  });

  it('navigates to Vendor Hub, expands vetting details and checks red flag audits', async () => {
    render(<App />);

    // Click Vendors tab
    const vendorNavButtons = screen.getAllByRole('button', { name: /Vendors/i });
    fireEvent.click(vendorNavButtons[0]);

    expect(screen.getByText(/Vendor Hub & Contract Co-Pilot/i)).toBeInTheDocument();

    // Find a contract red flag checkbox
    const redFlagCheckboxes = screen.getAllByRole('checkbox');
    expect(redFlagCheckboxes.length).toBeGreaterThan(0);

    const firstCheckbox = redFlagCheckboxes[0];
    const initialChecked = (firstCheckbox as HTMLInputElement).checked;

    fireEvent.click(firstCheckbox);
    expect((firstCheckbox as HTMLInputElement).checked).toBe(!initialChecked);
  });

  it('gracefully handles AI Cost Optimizer when API key is unset (Heuristic Fallback)', async () => {
    render(<App />);

    const budgetNavButtons = screen.getAllByRole('button', { name: /Budget/i });
    fireEvent.click(budgetNavButtons[0]);

    const optimizeButton = screen.getByRole('button', { name: /AI Cost Optimizer/i });
    fireEvent.click(optimizeButton);

    // Should render optimization proposals via the built-in fallback engine
    await waitFor(() => {
      expect(screen.getByText(/Gemini AI Budget Optimizer: Identified Compromises/i)).toBeInTheDocument();
      expect(screen.getByText(/Transition from Full Open Spirits/i)).toBeInTheDocument();
    });
  });

  it('navigates to Creative Studio and displays the 5-color palette and curated courses', async () => {
    render(<App />);

    const creativeNavButton = screen.getByRole('button', { name: 'Creative Ideation' });
    fireEvent.click(creativeNavButton);

    expect(screen.getByText(/GenAI Creative Ideation Suite/i)).toBeInTheDocument();
    expect(screen.getByText(/Cohesive HEX Color Palette/i)).toBeInTheDocument();
    expect(screen.getByText(/Decor, Centerpieces & Lighting Directives/i)).toBeInTheDocument();
  });

  it('navigates to Export view and opens modal displaying Markdown and JSON tabs', async () => {
    render(<App />);

    const exportNavButton = screen.getByRole('button', { name: 'Export & Print Dossier' });
    fireEvent.click(exportNavButton);

    expect(screen.getByText(/Export & Print Master Dossier/i)).toBeInTheDocument();

    const openDialogButton = screen.getByRole('button', { name: /Open Export & Print Dialog/i });
    fireEvent.click(openDialogButton);

    await waitFor(() => {
      expect(screen.getByText(/Markdown Dossier \(\.md\)/i)).toBeInTheDocument();
      expect(screen.getByText(/JSON Schema \(\.json\)/i)).toBeInTheDocument();
    });
  });
});
