import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptInput } from '../src/components/PromptInput';

describe('PromptInput', () => {
  it('renders a text input and submit button without crash', () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText(/enter a prompt/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('typing into the input updates the input value', async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/enter a prompt/i);
    await userEvent.type(input, 'hello world');
    expect(input).toHaveValue('hello world');
  });

  it('clicking submit calls onSubmit handler with the current input text', async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/enter a prompt/i);
    await userEvent.type(input, 'test prompt');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith('test prompt');
  });

  it('pressing Enter key submits the prompt', async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/enter a prompt/i);
    await userEvent.type(input, 'enter test{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('enter test');
  });

  it('submit button is disabled when input is empty', () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it('input is cleared after successful submission', async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/enter a prompt/i);
    await userEvent.type(input, 'clear me{Enter}');
    expect(input).toHaveValue('');
  });
});
